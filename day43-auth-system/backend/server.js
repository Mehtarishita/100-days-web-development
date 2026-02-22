const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "supersecretkey";

// Fake database
const users = [];

// SIGNUP
app.post("/signup", (req, res) => {

 const { username, password } = req.body;

 users.push({ username, password });

 res.json({ message: "User created" });

});

// LOGIN
app.post("/login", (req, res) => {

 const { username, password } = req.body;

 const user = users.find(
  u => u.username === username && u.password === password
 );

 if(!user) {
  return res.status(401).json({ error:"Invalid credentials"});
 }

 const token = jwt.sign({ username }, SECRET, { expiresIn:"1h" });

 res.json({ token });

});

// PROTECTED ROUTE
app.get("/dashboard", verifyToken, (req,res) => {

 res.json({ message: `Welcome ${req.user.username}` });

});

// AUTH MIDDLEWARE
function verifyToken(req,res,next){

 const header = req.headers.authorization;

 if(!header) return res.sendStatus(403);

 const token = header.split(" ")[1];

 jwt.verify(token, SECRET, (err,user) => {

  if(err) return res.sendStatus(403);

  req.user = user;
  next();

 });

}

app.listen(5000, () =>
 console.log("Auth server running on http://localhost:5000")
);