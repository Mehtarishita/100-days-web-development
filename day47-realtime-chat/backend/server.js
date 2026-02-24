const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecret";

let users = [];
let clients = {};

/* ================== AUTH ================== */

app.post("/signup", (req,res)=>{
  users.push(req.body);
  res.json({message:"Signup successful"});
});

app.post("/login",(req,res)=>{
  const {username,password} = req.body;
  const user = users.find(u=>u.username===username && u.password===password);

  if(!user) return res.status(401).json({message:"Invalid"});

  const token = jwt.sign({username},SECRET);
  res.json({token});
});

const server = app.listen(5000,()=>console.log("Server running on 5000"));

/* ================== WEBSOCKET ================== */

const wss = new WebSocket.Server({ server });

wss.on("connection",(ws,req)=>{

  ws.on("message",(msg)=>{
    const data = JSON.parse(msg);

    /* Auth handshake */
    if(data.type==="auth"){
      try{
        const decoded = jwt.verify(data.token,SECRET);
        ws.username = decoded.username;
        clients[decoded.username] = ws;

        broadcastUsers();
      }catch{
        ws.close();
      }
    }

    /* Public message */
    if(data.type==="public"){
      broadcast({
        type:"public",
        user: ws.username,
        message: data.message
      });
    }

    /* Private message */
    if(data.type==="private"){
      const target = clients[data.to];
      if(target){
        target.send(JSON.stringify({
          type:"private",
          from: ws.username,
          message:data.message
        }));
      }
    }

    /* Typing indicator */
    if(data.type==="typing"){
      broadcast({
        type:"typing",
        user: ws.username
      });
    }

  });

  ws.on("close",()=>{
    delete clients[ws.username];
    broadcastUsers();
  });

});

function broadcast(data){
  Object.values(clients).forEach(client=>{
    if(client.readyState===WebSocket.OPEN){
      client.send(JSON.stringify(data));
    }
  });
}

function broadcastUsers(){
  broadcast({
    type:"users",
    users:Object.keys(clients)
  });
}