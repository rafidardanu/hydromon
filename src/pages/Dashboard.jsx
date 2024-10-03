import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
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

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dbStatus, setDbStatus] = useState("checking");

  // Fungsi untuk fetch data harian
  const fetchDailyData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/monitoring/daily"
      );
      setDailyData(response.data);
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  }, []);

  // Fungsi untuk fetch data mingguan
  const fetchWeeklyData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/monitoring/weekly"
      );
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }, []);

  // Fungsi untuk mengecek status database
  const checkDbStatus = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/db-status");
      const status = response.data.status;
      setDbStatus(status);

      if (status === "connected") {
        // Jika status terhubung, fetch ulang data
        fetchDailyData();
        fetchWeeklyData();
      }
    } catch (error) {
      console.error("Error checking DB status:", error);
      setDbStatus("disconnected");
    }
  }, [fetchDailyData, fetchWeeklyData]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    } else {
      navigate("/login");
    }

    // Jalankan fungsi-fungsi secara periodik
    fetchDailyData();
    fetchWeeklyData();
    checkDbStatus();

    const dailyInterval = setInterval(fetchDailyData, 60000); // Perbarui data harian setiap menit
    const weeklyInterval = setInterval(fetchWeeklyData, 300000); // Perbarui data mingguan setiap 5 menit
    const statusInterval = setInterval(checkDbStatus, 5000); // Cek status database setiap 5 detik

    return () => {
      clearInterval(dailyInterval);
      clearInterval(weeklyInterval);
      clearInterval(statusInterval);
    };
  }, [navigate, fetchDailyData, fetchWeeklyData, checkDbStatus]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const [cardData, setCardData] = useState({
    watertemp: 0,
    waterph: 0,
    waterppm: 0,
    airtemp: 0,
    airhum: 0,
  });

  useEffect(() => {
    // Membuka koneksi WebSocket
    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const mqttData = JSON.parse(event.data); // Parsing JSON data yang diterima dari backend
      console.log("Data received from WebSocket: ", mqttData);

      // Update cardData dengan data yang diterima dari MQTT melalui WebSocket
      setCardData({
        watertemp: mqttData.watertemp || cardData.watertemp,
        waterph: mqttData.waterph || cardData.waterph,
        waterppm: mqttData.waterppm || cardData.waterppm,
        airtemp: mqttData.airtemp || cardData.airtemp,
        airhum: mqttData.airhum || cardData.airhum,
      });
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close(); // Menutup koneksi WebSocket saat komponen di-unmount
    };
  }, []);

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
        username={username}
      />
      <div className="content flex-grow-1 p-4">
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Tahap - 3</h5>
                <p className="card-text">Day - 43</p>
              </div>
            </div>
          </div>
          {Object.entries(cardData).map(([key, value]) => (
            <div className="col" key={key}>
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center">{value}</h2>
                  <p className="card-text text-center">
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Harian */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-5">Daily Chart</h5>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dailyData}>
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleTimeString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleString()
                      }
                    />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="watertemp"
                      name="Water Temp"
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="waterph"
                      name="Water pH"
                      stroke="#ffc658"
                    />
                    <Line
                      type="monotone"
                      dataKey="waterppm"
                      name="Water PPM"
                      stroke="#82ca9d"
                    />
                    <Line
                      type="monotone"
                      dataKey="airtemp"
                      name="Air Temp"
                      stroke="#ff7300"
                    />
                    <Line
                      type="monotone"
                      dataKey="airhum"
                      name="Air Humidity"
                      stroke="#413ea0"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart Mingguan */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-5">Weekly Chart</h5>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={weeklyData}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleString()
                      }
                    />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="avg_watertemp"
                      name="Water Temp"
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_waterph"
                      name="Water pH"
                      stroke="#ffc658"
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_waterppm"
                      name="Water PPM"
                      stroke="#82ca9d"
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_airtemp"
                      name="Air Temp"
                      stroke="#ff7300"
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_airhum"
                      name="Air Humidity"
                      stroke="#413ea0"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Status Database */}
        <div className="card bg-white mb-4">
          <div className="card-body">
            <h5 className="card-title">Database Status</h5>
            <p className="card-text">
              <span
                className={`badge ${
                  dbStatus === "connected" ? "bg-success" : "bg-danger"
                }`}
                style={{
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  fontWeight: "bold",
                }}
              >
                {dbStatus === "connected" ? "Connected" : "Disconnected"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
