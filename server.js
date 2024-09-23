/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hidroponik_monitoring",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// API endpoint untuk login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        res.json({
          message: "Login successful",
          user: { id: user.id, username: user.username },
        });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    });
  });
});

// API endpoint untuk register
app.post("/api/register", (req, res) => {
  const { fullname, username, gender, email, telephone, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: "Error hashing password" });
      return;
    }

    const query =
      "INSERT INTO users (fullname, username, gender, email, telephone, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [fullname, username, gender, email, telephone, hashedPassword],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: "Error registering user" });
          return;
        }
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
