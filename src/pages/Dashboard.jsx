import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import {
  CHART_TYPES,
  ACTUATOR_CONFIGS,
  STORAGE_KEYS,
  REFRESH_INTERVALS,
  METRIC_CONFIGS,
} from "../utils/constants";
import SetpointTable from '../components/dashboard/Setpoint';
import MetricCard from "../components/dashboard/MetricCard";
import ChartComponent from "../components/dashboard/ChartComponent";
import SystemStatus from "../components/dashboard/SystemStatus";
import ChemicalIndicator from "../components/dashboard/ChemicalIndicator";
import PumpIndicator from "../components/dashboard/PumpIndicator";
import LastUpdate from "../components/dashboard/LastUpdate";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_URL = import.meta.env.VITE_WS_URL;


// Styled Components
  const StyledCard = styled(Card)(({ theme }) => ({
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.04)",
      boxShadow: theme.shadows[8],
    },
  }));

const ChartSelector = styled(ToggleButtonGroup)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  zIndex: 1,
}));

// Helper functions for local storage
const getStoredData = (key, defaultValue) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

// Custom Hooks
const useAuth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) {
      setUsername(user.username);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return { username, handleLogout };
};

const useWebSocket = (
  setCardData,
  setActuatorStatus,
  setDeviceStatus,
  setMqttStatus
) => {
  const lastDataTimestamp = useRef(
    getStoredData(STORAGE_KEYS.LAST_UPDATE, null)
  );

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setMqttStatus("connected");
    };

    ws.onmessage = (event) => {
      const { topic, data } = JSON.parse(event.data);

      if (topic === "herbalawu/monitoring") {
        const processedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, Number(value)])
        );

        setCardData(processedData);
        setStoredData(STORAGE_KEYS.CARD_DATA, processedData);

        setDeviceStatus("connected");
        const timestamp = Date.now();
        lastDataTimestamp.current = timestamp;
        setStoredData(STORAGE_KEYS.LAST_UPDATE, timestamp);
      } else if (topic === "herbalawu/aktuator") {
        const processedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, Number(value)])
        );

        setActuatorStatus(processedData);
        setStoredData(STORAGE_KEYS.ACTUATOR_STATUS, processedData);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMqttStatus("disconnected");
      setDeviceStatus("disconnected");
      setTimeout(connectWebSocket, 5000);
    };

    return ws;
  }, [setCardData, setActuatorStatus, setDeviceStatus, setMqttStatus]);

  return { connectWebSocket, lastDataTimestamp };
};

// Main Dashboard Component
const Dashboard = () => {
  // State Management
  const [activePage, setActivePage] = useState("dashboard");
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dbStatus, setDbStatus] = useState("checking");
  const [mqttStatus, setMqttStatus] = useState("disconnected");
  const [deviceStatus, setDeviceStatus] = useState("disconnected");
  const [selectedDailyChart, setSelectedDailyChart] = useState(
    CHART_TYPES.TEMPERATURE
  );
  const [selectedWeeklyChart, setSelectedWeeklyChart] = useState(
    CHART_TYPES.TEMPERATURE
  );
  const [cardData, setCardData] = useState(() =>
    getStoredData(
      STORAGE_KEYS.CARD_DATA,
      Object.keys(METRIC_CONFIGS).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {}
      )
    )
  );

  const [actuatorStatus, setActuatorStatus] = useState(() =>
    getStoredData(
      STORAGE_KEYS.ACTUATOR_STATUS,
      Object.keys(ACTUATOR_CONFIGS).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {}
      )
    )
  );

  const [setpointData, setSetpointData] = useState([]);

  const navigate = useNavigate();
  const { username, handleLogout } = useAuth();
  const { connectWebSocket, lastDataTimestamp } = useWebSocket(
    setCardData,
    setActuatorStatus,
    setDeviceStatus,
    setMqttStatus
  );

  // API Functions
  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/${endpoint}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
    }
  }, []);

const checkDbStatus = useCallback(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/db-status`);
    setDbStatus(response.data.status);
    if (response.data.status === "connected") {
      fetchData("monitoring/daily", setDailyData);
      fetchData("monitoring/weekly", setWeeklyData);
      fetchData("setpoint", setSetpointData);
    }
  } catch (error) {
    console.error("Error checking DB status:", error);
    setDbStatus("disconnected");
  }
}, [fetchData]);

  const checkDeviceStatus = useCallback(() => {
    const now = Date.now();
    if (lastDataTimestamp.current && now - lastDataTimestamp.current > 5000) {
      setDeviceStatus("disconnected");
    }
  }, [lastDataTimestamp]);

  // Effect Hooks
useEffect(() => {
  fetchData("monitoring/daily", setDailyData);
  fetchData("monitoring/weekly", setWeeklyData);
  fetchData("setpoint", setSetpointData);
  checkDbStatus();

  const intervals = [
    setInterval(
      () => fetchData("monitoring/daily", setDailyData),
      REFRESH_INTERVALS.DAILY_DATA
    ),
    setInterval(
      () => fetchData("monitoring/weekly", setWeeklyData),
      REFRESH_INTERVALS.WEEKLY_DATA
    ),
    setInterval(checkDbStatus, REFRESH_INTERVALS.DB_STATUS),
    setInterval(checkDeviceStatus, REFRESH_INTERVALS.DEVICE_STATUS),
  ];

  const ws = connectWebSocket();

  return () => {
    intervals.forEach(clearInterval);
    ws.close();
  };
}, [fetchData, checkDbStatus, connectWebSocket, checkDeviceStatus]);

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

      <Box className="content flex-grow-1 p-3">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "success.main", mb: 2 }}
        >
          Dashboard
        </Typography>

        {/* Setpoint and Metric */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4} md={2}>
            <StyledCard>
              <CardContent>
                <SetpointTable data={setpointData} />
              </CardContent>
            </StyledCard>
          </Grid>
          {Object.entries(cardData).map(([key, value]) => (
            <Grid item xs={12} sm={4} md={2} key={key}>
              <MetricCard
                value={Number(value)}
                {...METRIC_CONFIGS[key]}
                metricKey={key}
                setpointData={setpointData}
              />
            </Grid>
          ))}
        </Grid>

        {/* Chart Grid */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <ChartSelector
                value={selectedDailyChart}
                exclusive
                onChange={(e, value) => value && setSelectedDailyChart(value)}
                size="small"
              >
                <ToggleButton value={CHART_TYPES.TEMPERATURE}>
                  Temperature & Humidity
                </ToggleButton>
                <ToggleButton value={CHART_TYPES.PH}>pH</ToggleButton>
                <ToggleButton value={CHART_TYPES.PPM}>PPM</ToggleButton>
              </ChartSelector>
              <ChartComponent
                data={dailyData}
                title="Daily Chart"
                selectedChart={selectedDailyChart}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <ChartSelector
                value={selectedWeeklyChart}
                exclusive
                onChange={(e, value) => value && setSelectedWeeklyChart(value)}
                size="small"
              >
                <ToggleButton value={CHART_TYPES.TEMPERATURE}>
                  Temperature & Humidity
                </ToggleButton>
                <ToggleButton value={CHART_TYPES.PH}>pH</ToggleButton>
                <ToggleButton value={CHART_TYPES.PPM}>PPM</ToggleButton>
              </ChartSelector>
              <ChartComponent
                data={weeklyData}
                title="Weekly Chart"
                selectedChart={selectedWeeklyChart}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Status and Controls Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <SystemStatus
              dbStatus={dbStatus}
              mqttStatus={mqttStatus}
              deviceStatus={deviceStatus}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <ChemicalIndicator actuatorStatus={actuatorStatus} />
          </Grid>
          <Grid item xs={12} md={3}>
            <PumpIndicator actuatorStatus={actuatorStatus} />
          </Grid>
          <Grid item xs={12} md={3}>
            <LastUpdate
              lastUpdate={getStoredData(STORAGE_KEYS.LAST_UPDATE, null)}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
