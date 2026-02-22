const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecret";

let users = []; // fake DB
let resetTokens = {}; // token storage

// SIGNUP
app.post("/signup", async (req,res)=>{

 const {username,password} = req.body;

 const hashed = await bcrypt.hash(password,10);

 users.push({username,password:hashed});

 res.json({message:"User created"});
});

// LOGIN
app.post("/login", async (req,res)=>{

 const {username,password} = req.body;

 const user = users.find(u=>u.username===username);

 if(!user) return res.status(401).json({error:"Invalid"});

 const match = await bcrypt.compare(password,user.password);

 if(!match) return res.status(401).json({error:"Invalid"});

 const token = jwt.sign({username},SECRET);

 res.json({token});
});

// FORGOT PASSWORD
app.post("/forgot-password",(req,res)=>{

 const {username} = req.body;

 const token = jwt.sign({username},"resetsecret",{expiresIn:"5m"});

 resetTokens[token]=username;

 console.log("RESET LINK:");
 console.log(`http://127.0.0.1:5500/day44-password-reset/frontend/reset.html?token=${token}`);

 res.json({message:"Reset link generated (check terminal)"});
});

// RESET PASSWORD
app.post("/reset-password", async (req,res)=>{

 const {token,newPassword} = req.body;

 try{

 const decoded = jwt.verify(token,"resetsecret");

 const username = resetTokens[token];

 const user = users.find(u=>u.username===username);

 user.password = await bcrypt.hash(newPassword,10);

 delete resetTokens[token];

 res.json({message:"Password updated"});

 }catch(err){

 res.status(400).json({error:"Invalid token"});

 }

});

app.listen(5000,()=>console.log("Server running on 5000"));