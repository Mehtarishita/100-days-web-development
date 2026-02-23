const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey";

let users = [];

/* ======================
   SIGNUP
====================== */
app.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword,
    role
  });

  res.json({ message: "User created successfully" });
});

/* ======================
   LOGIN
====================== */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/* ======================
   AUTH MIDDLEWARE
====================== */
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ======================
   ADMIN ROUTE
====================== */
app.get("/admin", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({ message: "Welcome Admin Panel 😎" });
});

/* ======================
   USER ROUTE
====================== */
app.get("/dashboard", authenticate, (req, res) => {
  res.json({
    message: `Welcome ${req.user.role} ${req.user.username}`
  });
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});