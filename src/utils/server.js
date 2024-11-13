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

// Database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
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

app.use(checkDbConnection);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

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
      console.error("Database error during login:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Authentication error" });
      }

      if (match) {
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION || "1h" }
        );
        res.json({
          message: "Login successful",
          user: { id: user.id, username: user.username, role: user.role },
          token: token,
        });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    });
  });
});

// API endpoint for registration (admin role only)
app.post("/api/register", verifyToken, (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const { fullname, username, gender, email, telephone, password, role } =
    req.body;

  bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Error hashing password" });
      }

      const query =
        "INSERT INTO users (fullname, username, gender, email, telephone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [fullname, username, gender, email, telephone, hashedPassword, role],
        (err, result) => {
          if (err) {
            console.error("Error registering user:", err);
            return res.status(500).json({ error: "Error registering user" });
          }
          res.json({ message: "User registered successfully" });
        }
      );
    }
  );
});

// API endpoint for employee data (admin gets all, user gets own)
app.get("/api/employees", verifyToken, (req, res) => {
  let query;
  let queryParams;

  if (req.userRole === "admin") {
    query = "SELECT id, fullname, username, email, telephone, role FROM users";
    queryParams = [];
  } else {
    query =
      "SELECT id, fullname, username, email, telephone, role FROM users WHERE id = ?";
    queryParams = [req.userId];
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching employee data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// API endpoint for setpoints
app.get("/api/setpoint", verifyToken, (req, res) => {
  const query = `
    SELECT id, profile, watertemp, waterppm, waterph, status
    FROM setpoint
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching setpoint:", err);
      return res.status(500).json({ error: "Error fetching setpoint" });
    }
    res.json(results);
  });
});

// API endpoint for daily chart
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
      console.error("Error fetching daily monitoring data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const fullDayData = Array.from({ length: 24 }, (_, i) => {
      const existingData = results.find((r) => r.hour === i);
      return (
        existingData || {
          hour: i,
          avg_watertemp: null,
          avg_waterppm: null,
          avg_waterph: null,
          avg_airtemp: null,
          avg_airhum: null,
        }
      );
    });

    res.json(fullDayData);
  });
});

// API endpoint for weekly chart
app.get("/api/monitoring/weekly", verifyToken, (req, res) => {
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
      console.error("Error fetching weekly monitoring data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// API endpoint for monitoring history
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
      return res
        .status(500)
        .json({ error: "Error fetching monitoring history" });
    }
    res.json(results);
  });
});

// Route to update employee
app.put("/api/employees/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { fullname, email, telephone } = req.body;

  if (req.userRole !== "admin" && req.userId !== parseInt(id)) {
    return res.status(403).json({
      error: "Access denied. You can only update your own information.",
    });
  }

  const query =
    "UPDATE users SET fullname = ?, email = ?, telephone = ? WHERE id = ?";
  db.query(query, [fullname, email, telephone, id], (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ error: "Error updating employee" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee updated successfully" });
  });
});

// Route to delete employee
app.delete("/api/employees/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Error deleting employee" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
