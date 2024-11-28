/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Grid,
  CardContent,
  ToggleButton,
} from "@mui/material";
import { StyledCard, ChartSelector } from "../styles/styledComponents";
import Sidebar from "../components/Sidebar";
import {
  CHART_TYPES,
  ACTUATOR_CONFIGS,
  STORAGE_KEYS,
  REFRESH_INTERVALS,
  METRIC_CONFIGS,
} from "../utils/constants";
import SetpointTable from "../components/dashboard/Setpoint";
import MetricCard from "../components/dashboard/MetricCard";
import ChartComponent from "../components/dashboard/ChartComponent";
import SystemStatus from "../components/dashboard/SystemStatus";
import ChemicalIndicator from "../components/dashboard/ChemicalIndicator";
import PumpIndicator from "../components/dashboard/PumpIndicator";
import LastUpdate from "../components/dashboard/LastUpdate";
import { isTokenExpired, removeAuthToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

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
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || isTokenExpired(token) || !user?.username) {
      handleLogout();
      return;
    }

    setUsername(user.username);
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return { username, handleLogout };
};

const useWebSocket = (
  setMonitoringData,
  setActuatorData,
  setDeviceStatus,
  setMqttStatus
) => {
  const lastMonitoringTimestamp = useRef(
    getStoredData(STORAGE_KEYS.LAST_MONITORING_UPDATE, null)
  );
  const lastActuatorTimestamp = useRef(
    getStoredData(STORAGE_KEYS.LAST_ACTUATOR_UPDATE, null)
  );

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      return null;
    }

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

        setMonitoringData(processedData);
        setStoredData(STORAGE_KEYS.DATA_MONITORING, processedData);

        setDeviceStatus("connected");
        const monitoringTimestamp = Date.now();
        lastMonitoringTimestamp.current = monitoringTimestamp;
        setStoredData(STORAGE_KEYS.LAST_MONITORING_UPDATE, monitoringTimestamp);
      } else if (topic === "herbalawu/aktuator") {
        const processedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, Number(value)])
        );

        setActuatorData(processedData);
        setStoredData(STORAGE_KEYS.DATA_ACTUATOR, processedData);

        const actuatorTimestamp = Date.now();
        lastActuatorTimestamp.current = actuatorTimestamp;
        setStoredData(STORAGE_KEYS.LAST_ACTUATOR_UPDATE, actuatorTimestamp);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMqttStatus("disconnected");
      setDeviceStatus("disconnected");
      connectWebSocket();
    };

    return ws;
  }, [setMonitoringData, setActuatorData, setDeviceStatus, setMqttStatus]);

  return {
    connectWebSocket,
    lastMonitoringTimestamp,
    lastActuatorTimestamp,
  };
};

// Main Dashboard Component
const Dashboard = () => {
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

  const [monitoringData, setMonitoringData] = useState(() =>
    getStoredData(
      STORAGE_KEYS.DATA_MONITORING,
      Object.keys(METRIC_CONFIGS).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {}
      )
    )
  );

  const [actuatorData, setActuatorData] = useState(() =>
    getStoredData(
      STORAGE_KEYS.DATA_ACTUATOR,
      Object.keys(ACTUATOR_CONFIGS).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {}
      )
    )
  );

  const [setpointData, setProfileData] = useState([]);

  const navigate = useNavigate();
  const { username, handleLogout } = useAuth();

  // WebSocket dan timestamp hooks
  const { connectWebSocket, lastMonitoringTimestamp, lastActuatorTimestamp } =
    useWebSocket(
      setMonitoringData,
      setActuatorData,
      setDeviceStatus,
      setMqttStatus
    );

  // API Functions
  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setter(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
      console.error(`Error fetching ${endpoint} data:`, error);
    }
  }, []);

  // Check Database Status
  const checkDbStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/db-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDbStatus(response.data.status);
      if (response.data.status === "connected") {
        fetchData("monitoring/daily", setDailyData);
        fetchData("monitoring/weekly", setWeeklyData);
      }
    } catch (error) {
      console.error("Error checking DB status:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
      setDbStatus("disconnected");
    }
  }, [fetchData]);

  // Device Status Check
  const checkDeviceStatus = useCallback(() => {
    const now = Date.now();

    if (
      lastMonitoringTimestamp.current &&
      now - lastMonitoringTimestamp.current > REFRESH_INTERVALS.DEVICE_STATUS
    ) {
      setDeviceStatus("disconnected");
    }

    if (
      lastActuatorTimestamp.current &&
      now - lastActuatorTimestamp.current > REFRESH_INTERVALS.DEVICE_STATUS
    ) {
      // Add Logic
    }
  }, [lastMonitoringTimestamp, lastActuatorTimestamp]);

  // Effect Hooks
  useEffect(() => {
    fetchData("monitoring/daily", setDailyData);
    fetchData("monitoring/weekly", setWeeklyData);
    fetchData("profile", setProfileData);
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
      setInterval(
        () => fetchData("profile", setProfileData),
        REFRESH_INTERVALS.PROFILE_DATA
      ),
      setInterval(checkDbStatus, REFRESH_INTERVALS.DB_STATUS),
      setInterval(checkDeviceStatus, REFRESH_INTERVALS.DEVICE_STATUS),
    ];

    const ws = connectWebSocket();

    return () => {
      intervals.forEach(clearInterval);
      ws && ws.close();
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

        {/* Setpoint dan Metric Grid */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4} md={2}>
            <StyledCard>
              <CardContent>
                <SetpointTable data={setpointData} />
              </CardContent>
            </StyledCard>
          </Grid>
          {Object.entries(monitoringData).map(([key, value]) => (
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

        {/* Status Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <SystemStatus
              dbStatus={dbStatus}
              mqttStatus={mqttStatus}
              deviceStatus={deviceStatus}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <ChemicalIndicator actuatorData={actuatorData} />
          </Grid>
          <Grid item xs={12} md={3}>
            <PumpIndicator actuatorData={actuatorData} />
          </Grid>
          <Grid item xs={12} md={3}>
            <LastUpdate
              lastMonitoringUpdate={
                lastMonitoringTimestamp.current ||
                getStoredData(STORAGE_KEYS.LAST_MONITORING_UPDATE, null)
              }
              lastActuatorUpdate={
                lastActuatorTimestamp.current ||
                getStoredData(STORAGE_KEYS.LAST_ACTUATOR_UPDATE, null)
              }
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
