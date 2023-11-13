// Assuming you have a PostgreSQL database set up and a table named 'users' with columns 'id', 'username', 'password'

const { Pool } = require("pg");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Secret key for JWT
const JWT_SECRET = "your-secret-key";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token is missing." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user;
    next();
  });
};

// Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    const user = result.rows[0];
    res.status(201).json({ userId: user.id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login and get a JWT token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from the database
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected route example
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
