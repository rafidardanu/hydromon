/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontSize: "1.2rem",
  padding: "20px 10px",
  borderRadius: "10px",
  fontWeight: "bold",
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto Mono', monospace",
  fontSize: "3rem",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

const metricConfigs = {
  watertemp: { unit: "°C", label: "Water Temperature" },
  waterph: { unit: "pH", label: "Water pH" },
  waterppm: { unit: "ppm", label: "Water PPM" },
  airtemp: { unit: "°C", label: "Air Temperature" },
  airhum: { unit: "%", label: "Air Humidity" },
};

const MetricCard = ({ value, unit, label, color }) => (
  <StyledCard>
    <CardContent>
      <Typography variant="h6" align="center" gutterBottom>
        {label}
      </Typography>
      <MetricValue style={{ color }}>
        {value} {unit}
      </MetricValue>
    </CardContent>
  </StyledCard>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dbStatus, setDbStatus] = useState("checking");
  const [mqttStatus, setMqttStatus] = useState("disconnected");
  const [deviceStatus, setDeviceStatus] = useState("disconnected");
  const [cardData, setCardData] = useState({
    watertemp: 0,
    waterph: 0,
    waterppm: 0,
    airtemp: 0,
    airhum: 0,
  });

  // Add refs for managing device status check
  const deviceStatusInterval = useRef(null);
  const lastDataTimestamp = useRef(null);

  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/${endpoint}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
    }
  }, []);

  const checkDbStatus = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/db-status");
      setDbStatus(response.data.status);
      if (response.data.status === "connected") {
        fetchData("monitoring/daily", setDailyData);
        fetchData("monitoring/weekly", setWeeklyData);
      }
    } catch (error) {
      console.error("Error checking DB status:", error);
      setDbStatus("disconnected");
    }
  }, [fetchData]);

  // Add function to check device status
  const checkDeviceStatus = useCallback(() => {
    const now = Date.now();
    if (lastDataTimestamp.current && now - lastDataTimestamp.current > 5000) {
      setDeviceStatus("disconnected");
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setMqttStatus("connected");
    };

    ws.onmessage = (event) => {
      const mqttData = JSON.parse(event.data);
      setCardData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(mqttData).map(([key, value]) => [key, Number(value)])
        ),
      }));
      // Update device status and timestamp when data is received
      setDeviceStatus("connected");
      lastDataTimestamp.current = Date.now();
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMqttStatus("disconnected");
      setDeviceStatus("disconnected");
      setTimeout(connectWebSocket, 5000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) {
      setUsername(user.username);
    } else {
      navigate("/login");
    }

    fetchData("monitoring/daily", setDailyData);
    fetchData("monitoring/weekly", setWeeklyData);
    checkDbStatus();

    // Set up intervals for data fetching and status checks
    const intervals = [
      setInterval(() => fetchData("monitoring/daily", setDailyData), 60000),
      setInterval(() => fetchData("monitoring/weekly", setWeeklyData), 300000),
      setInterval(checkDbStatus, 5000),
      setInterval(checkDeviceStatus, 1000), // Check device status every second
    ];

    const ws = connectWebSocket();

    return () => {
      intervals.forEach(clearInterval);
      ws.close();
    };
  }, [navigate, fetchData, checkDbStatus, connectWebSocket, checkDeviceStatus]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getLineColor = (key) => {
    const colors = {
      watertemp: "#8884d8",
      waterph: "#ffc658",
      waterppm: "#82ca9d",
      airtemp: "#ff7300",
      airhum: "#413ea0",
    };
    return colors[key] || "#000000";
  };

  const renderLineChart = (data, title) => (
    <Paper elevation={6} style={{ borderRadius: 15, padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis
            dataKey={title === "Daily Chart" ? "hour" : "date"}
            tickFormatter={(value) =>
              title === "Daily Chart"
                ? `${value}:00`
                : new Date(value).toLocaleDateString()
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) =>
              title === "Daily Chart"
                ? `${label}:00`
                : new Date(label).toLocaleString()
            }
            formatter={(value, name) => {
              const metricKey = name.split("_")[1];
              const config = metricConfigs[metricKey] || {};
              return [
                `${Number(value).toFixed(1)}${config.unit || ""}`,
                config.label || name,
              ];
            }}
          />
          <Legend formatter={(value) => metricConfigs[value]?.label || value} />
          <CartesianGrid strokeDasharray="3 3" />
          {Object.keys(metricConfigs).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={`avg_${key}`}
              name={key}
              stroke={getLineColor(key)}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={(page) => {
          setActivePage(page);
          navigate(`/${page}`);
        }}
        handleLogout={handleLogout}
        username={username}
      />
      <Box className="content flex-grow-1 p-4">
        <Typography
          variant="h4"
          gutterBottom
          className="fw-bold text-success mb-4"
        >
          Dashboard
        </Typography>

        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12} sm={4} md={2}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6">Tahap - 3</Typography>
                <Typography variant="body1">Day - 43</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          {Object.entries(cardData).map(([key, value]) => (
            <Grid item xs={12} sm={4} md={2} key={key}>
              <MetricCard
                value={Number(value)}
                unit={metricConfigs[key].unit}
                label={metricConfigs[key].label}
                color={getLineColor(key)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12} md={6}>
            {renderLineChart(dailyData, "Daily Chart")}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderLineChart(weeklyData, "Weekly Chart")}
          </Grid>
        </Grid>

        <Grid container spacing={3} className="mb-4">
          {[
            { label: "Database Status", status: dbStatus },
            { label: "MQTT Status", status: mqttStatus },
            { label: "Device Status", status: deviceStatus },
          ].map(({ label, status }) => (
            <Grid item xs={12} sm={4} key={label}>
              <Paper
                elevation={6}
                style={{ borderRadius: 15, padding: "20px" }}
              >
                <Typography variant="h6" gutterBottom>
                  {label}
                </Typography>
                <StyledChip
                  label={status === "connected" ? "Connected" : "Disconnected"}
                  color={status === "connected" ? "success" : "error"}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
