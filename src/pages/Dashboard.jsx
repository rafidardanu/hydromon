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

// Styled components (unchanged)
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

// Metric configurations (unchanged)
const metricConfigs = {
  watertemp: { unit: "°C", label: "Water Temperature" },
  waterph: { unit: "pH", label: "Water pH" },
  waterppm: { unit: "ppm", label: "Water PPM" },
  airtemp: { unit: "°C", label: "Air Temperature" },
  airhum: { unit: "%", label: "Air Humidity" },
};

// Metric Card Component (unchanged)
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

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dbStatus, setDbStatus] = useState("checking");
  const [mqttStatus, setMqttStatus] = useState("disconnected");
  const [deviceStatus, setDeviceStatus] = useState("disconnected");
  const [lastDataReceived, setLastDataReceived] = useState(() => {
    const savedTimestamp = localStorage.getItem("lastDataTimestamp");
    return savedTimestamp ? new Date(parseInt(savedTimestamp)) : null;
  });
  const [cardData, setCardData] = useState(() => {
    const savedData = localStorage.getItem("lastMetricData");
    return savedData
      ? JSON.parse(savedData)
      : {
          watertemp: 0,
          waterph: 0,
          waterppm: 0,
          airtemp: 0,
          airhum: 0,
        };
  });

  const wsRef = useRef(null);

  // Fetch data functions (unchanged)
  const fetchDailyData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/monitoring/daily",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setDailyData(response.data);
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  }, []);

  const fetchWeeklyData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/monitoring/weekly",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }, []);

  const checkDbStatus = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/db-status");
      const status = response.data.status;
      setDbStatus(status);

      if (status === "connected") {
        fetchDailyData();
        fetchWeeklyData();
      }
    } catch (error) {
      console.error("Error checking DB status:", error);
      setDbStatus("disconnected");
    }
  }, [fetchDailyData, fetchWeeklyData]);

  // WebSocket connection function (updated to save timestamp)
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setMqttStatus("connected");
    };

    ws.onmessage = (event) => {
      const mqttData = JSON.parse(event.data);
      console.log("Data received from WebSocket: ", mqttData);

      const newCardData = {
        ...cardData,
        ...Object.fromEntries(
          Object.entries(mqttData).map(([key, value]) => [key, Number(value)])
        ),
      };

      setCardData(newCardData);
      localStorage.setItem("lastMetricData", JSON.stringify(newCardData));

      const currentTimestamp = new Date();
      setLastDataReceived(currentTimestamp);
      localStorage.setItem("lastDataTimestamp", currentTimestamp.getTime().toString());

      setDeviceStatus("connected");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMqttStatus("disconnected");
      wsRef.current = null;
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;
  }, [cardData]);

  // Effects (unchanged)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    } else {
      navigate("/login");
    }

    fetchDailyData();
    fetchWeeklyData();
    checkDbStatus();

    const dailyInterval = setInterval(fetchDailyData, 60000);
    const weeklyInterval = setInterval(fetchWeeklyData, 300000);
    const statusInterval = setInterval(checkDbStatus, 5000);

    connectWebSocket();

    const checkDeviceStatus = setInterval(() => {
      if (lastDataReceived) {
        const timeSinceLastData = new Date() - lastDataReceived;
        if (timeSinceLastData > 5000) {
          setDeviceStatus("disconnected");
        }
      }
    }, 1000);

    return () => {
      clearInterval(dailyInterval);
      clearInterval(weeklyInterval);
      clearInterval(statusInterval);
      clearInterval(checkDeviceStatus);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [
    navigate,
    fetchDailyData,
    fetchWeeklyData,
    checkDbStatus,
    connectWebSocket,
    lastDataReceived,
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
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
          <YAxis tickFormatter={(value) => Number(value)} />
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
          <Legend
            formatter={(value) => {
              const config = metricConfigs[value] || {};
              return config.label || value;
            }}
          />
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

  const formatLastUpdate = (date) => {
    if (!date) return "No data yet";
    return date.toLocaleString("en-US", {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={handleNavigation}
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
                <Typography variant="body2" color="textSecondary">
                  Last Update: {formatLastUpdate(lastDataReceived)}
                </Typography>
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

        {/* Daily and Weekly charts */}
        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12} md={6}>
            {renderLineChart(dailyData, "Daily Chart")}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderLineChart(weeklyData, "Weekly Chart")}
          </Grid>
        </Grid>

        {/* Status indicators */}
        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12} sm={4}>
            <Paper elevation={6} style={{ borderRadius: 15, padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Database Status
              </Typography>
              <StyledChip
                label={dbStatus === "connected" ? "Connected" : "Disconnected"}
                color={dbStatus === "connected" ? "success" : "error"}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={6} style={{ borderRadius: 15, padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                MQTT Status
              </Typography>
              <StyledChip
                label={
                  mqttStatus === "connected" ? "Connected" : "Disconnected"
                }
                color={mqttStatus === "connected" ? "success" : "error"}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={6} style={{ borderRadius: 15, padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Device Status
              </Typography>
              <StyledChip
                label={
                  deviceStatus === "connected" ? "Connected" : "Disconnected"
                }
                color={deviceStatus === "connected" ? "success" : "error"}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
