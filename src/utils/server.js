/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hidroponik_monitoring",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware cek koneksi database
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

app.use(checkDbConnection);

// API endpoint cek status database
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

// API endpoint login
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
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({
          message: "Login successful",
          user: { id: user.id, username: user.username, role: user.role },
          token: token
        });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    });
  });
});

// Middleware Verifikasi token jwt
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// API endpoint register (role admin)
app.post("/api/register", verifyToken, (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { fullname, username, gender, email, telephone, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: "Error hashing password" });
      return;
    }

    const query =
      "INSERT INTO users (fullname, username, gender, email, telephone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [fullname, username, gender, email, telephone, hashedPassword, role],
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

// API endpoint data employee (admin get semua, user get sendiri)
app.get("/api/employees", verifyToken, (req, res) => {
  let query;
  let queryParams;

  if (req.userRole === 'admin') {
    query = "SELECT id, fullname, username, email, telephone, role FROM users";
    queryParams = [];
  } else {
    query = "SELECT id, fullname, username, email, telephone, role FROM users WHERE id = ?";
    queryParams = [req.userId];
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(results);
  });
});

// API endpoint daily chart
app.get("/api/monitoring/daily", verifyToken, (req, res) => {
  const query = `
    SELECT 
      HOUR(timestamp) AS hour,
      AVG(watertemp) AS avg_watertemp,
      AVG(waterppm) AS avg_waterppm,
      AVG(waterph) AS avg_waterph,
      AVG(airtemp) AS avg_airtemp,
      AVG(airhum) AS avg_airhum
    FROM monitoring
    WHERE DATE(timestamp) = CURDATE()
    GROUP BY HOUR(timestamp)
    ORDER BY HOUR(timestamp) ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    // Fill in missing hours with null values
    const fullDayData = Array.from({ length: 24 }, (_, i) => {
      const existingData = results.find(r => r.hour === i);
      return existingData || {
        hour: i,
        avg_watertemp: null,
        avg_waterppm: null,
        avg_waterph: null,
        avg_airtemp: null,
        avg_airhum: null
      };
    });

    res.json(fullDayData);
  });
});

// API endpoint weekly chart
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

// API endpoint monitoring history
app.get("/api/history/monitoring", verifyToken, (req, res) => {
  const { startDate, endDate } = req.query;
  let query = `
    SELECT timestamp, watertemp, waterppm, waterph, airtemp, airhum
    FROM monitoring
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching monitoring history:", err);
      res.status(500).json({ error: "Error fetching monitoring history" });
      return;
    }
    res.json(results);
  });
});

// API endpoint actuator history
app.get("/api/history/actuator", verifyToken, (req, res) => {
  const { startDate, endDate } = req.query;
  let query = `
    SELECT timestamp, actuator_nutrisi, actuator_ph_up, actuator_ph_down, 
           actuator_air_baku, actuator_pompa_utama_1, actuator_pompa_utama_2
    FROM aktuator
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching actuator history:", err);
      res.status(500).json({ error: "Error fetching actuator history" });
      return;
    }
    res.json(results);
  });
});

// route update employee
app.put("/api/employees/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { fullname, email, telephone } = req.body;

  if (req.userRole !== "admin" && req.userId !== parseInt(id)) {
    return res
      .status(403)
      .json({
        error: "Access denied. You can only update your own information.",
      });
  }

  const query =
    "UPDATE users SET fullname = ?, email = ?, telephone = ? WHERE id = ?";
  db.query(query, [fullname, email, telephone, id], (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ error: "Error updating employee" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.json({ message: "Employee updated successfully" });
  });
});

// route delete employee
app.delete("/api/employees/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  // Only admin
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error deleting employee" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.json({ message: "Employee deleted successfully" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
