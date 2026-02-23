const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecret";

let users = [];
let sockets = [];

app.post("/signup", (req,res)=>{
  users.push(req.body);
  res.json({message:"Signup success"});
});

app.post("/login",(req,res)=>{
  const {username,password} = req.body;

  const user = users.find(u=>u.username===username && u.password===password);

  if(!user) return res.status(401).json({message:"Invalid"});

  const token = jwt.sign({username},SECRET);
  res.json({token});
});

const server = app.listen(5000,()=>console.log("Server running on 5000"));

/* WEBSOCKET SERVER */
const wss = new WebSocket.Server({ server });

wss.on("connection",(ws,req)=>{
  sockets.push(ws);

  ws.on("message",(msg)=>{
    const data = JSON.parse(msg);

    if(data.type==="notify"){
      sockets.forEach(client=>{
        if(client.readyState===WebSocket.OPEN){
          client.send(JSON.stringify({
            type:"notification",
            message:data.message
          }));
        }
      });
    }
  });
});