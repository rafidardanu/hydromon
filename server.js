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

// Database connection configuration
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hidroponik_monitoring",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).json({ error: "Database connection error" });
    }
    connection.release();
    next();
  });
};

// Use the middleware for all routes
app.use(checkDbConnection);

// API endpoint to check database status
app.get("/api/db-status", (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.json({ status: "disconnected" });
    }
    connection.release();
    res.json({ status: "connected" });
  });
});

// API endpoint for login
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

// API endpoint for register
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

// API endpoint for daily chart
app.get("/api/monitoring/daily", (req, res) => {
  const query = `
    SELECT watertemp, waterppm, waterph, airtemp, airhum, timestamp
    FROM monitoring
    WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY timestamp ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json(results);
  });
});

// API endpoint for weekly chart
app.get("/api/monitoring/weekly", (req, res) => {
  const query = `
    SELECT 
      DATE(timestamp) AS date,
      AVG(watertemp) AS avg_watertemp,
      AVG(waterppm) AS avg_waterppm,
      AVG(waterph) AS avg_waterph,
      AVG(airtemp) AS avg_airtemp,
      AVG(airhum) AS avg_airhum
    FROM monitoring
    WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json(results);
  });
});

// API endpoint for actuator status
app.get("/api/actuator/status", (req, res) => {
  const query = `
    SELECT * FROM aktuator
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "No actuator data found" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
