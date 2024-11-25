/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Pagination } from "@mui/material";
import Sidebar from "../components/Sidebar";
import HistoryTable from "../components/history/HistoryTable";
import HistoryFilter from "../components/history/HistoryFilter";
import { isTokenExpired, removeAuthToken } from "../utils/auth";
import { format } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const History = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("history");
  const [username, setUsername] = useState("");
  const [monitoringData, setMonitoringData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(16);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [targetValues, setTargetValues] = useState({
    watertemp: 0,
    waterph: 0,
    waterppm: 0,
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      if (user && user.username) {
        setUsername(user.username);
        await fetchProfiles(token);
        if (isFiltering) {
          await fetchFilteredData(token);
        } else {
          await fetchAllData(token);
        }
      } else {
        navigate("/login");
      }
    };

    checkAuthAndFetch();
  }, [isFiltering, startDate, endDate, navigate]);

  const calculateError = (measured, target) => {
    const error = ((Math.abs(measured - target) / target) * 100).toFixed(2);
    return error;
  };

  const fetchProfiles = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const handleProfileChange = (event) => {
    const profileId = event.target.value;
    setSelectedProfile(profileId);
    const selectedProfileData = profiles.find((p) => p.id === profileId);
    if (selectedProfileData) {
      setTargetValues({
        watertemp: selectedProfileData.watertemp,
        waterph: selectedProfileData.waterph,
        waterppm: selectedProfileData.waterppm,
      });
    }
  };

  const fetchAllData = async (token) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/history/monitoring`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setMonitoringData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchFilteredData = async (token) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/history/monitoring`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        }
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setMonitoringData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDateChange = (type, value) => {
    setPage(1);
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setIsFiltering(type === "start" ? value && endDate : startDate && value);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFiltering(false);
    setPage(1);
  };

const exportToCSV = () => {
    // Get selected profile info
    const selectedProfileData = profiles.find((p) => p.id === selectedProfile);
    const profileName = selectedProfileData
      ? selectedProfileData.profile
      : "No Profile Selected";

    let csvContent = "\ufeff";

    // Add metadata section with proper spacing
    csvContent += "Profile Information\n\n";
    csvContent += `Selected Profile,${profileName}\n\n`;

    if (selectedProfile) {
      csvContent += "Target Values\n";
      csvContent += `Water Temperature,${targetValues.watertemp} Celsius\n`;
      csvContent += `Water pH,${targetValues.waterph}\n`;
      csvContent += `Water PPM,${targetValues.waterppm}\n\n`;
    }

    csvContent += "Measurement Data\n";

    const headers = [
      "Timestamp",
      "Water Temperature (Celsius)",
      selectedProfile ? "Temperature Error (%)" : null,
      "Water pH",
      selectedProfile ? "pH Error (%)" : null,
      "Water PPM",
      selectedProfile ? "PPM Error (%)" : null,
      "Air Temperature (Celsius)",
      "Air Humidity (%)",
    ].filter(Boolean);

    csvContent += headers.join(",") + "\n";

    // Process data rows
    monitoringData.forEach((item) => {
      const row = [
        format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss"),

        item.watertemp.toFixed(2),

        selectedProfile
          ? calculateError(item.watertemp, targetValues.watertemp)
          : null,

        item.waterph.toFixed(2),

        selectedProfile
          ? calculateError(item.waterph, targetValues.waterph)
          : null,

        item.waterppm.toFixed(2),

        selectedProfile
          ? calculateError(item.waterppm, targetValues.waterppm)
          : null,

        item.airtemp.toFixed(2),

        item.airhum.toFixed(2),
      ].filter(Boolean);

      csvContent += row.join(",") + "\n";
    });

    // if (selectedProfile) {
    //   csvContent += "\nSummary Statistics\n";

    //   // Calculate averages
    //   const avgWaterTemp =
    //     monitoringData.reduce((sum, item) => sum + item.watertemp, 0) /
    //     monitoringData.length;
    //   const avgWaterPh =
    //     monitoringData.reduce((sum, item) => sum + item.waterph, 0) /
    //     monitoringData.length;
    //   const avgWaterPpm =
    //     monitoringData.reduce((sum, item) => sum + item.waterppm, 0) /
    //     monitoringData.length;

    //   // Calculate errors
    //   const avgWaterTempError = calculateError(
    //     avgWaterTemp,
    //     targetValues.watertemp
    //   );
    //   const avgWaterPhError = calculateError(avgWaterPh, targetValues.waterph);
    //   const avgWaterPpmError = calculateError(
    //     avgWaterPpm,
    //     targetValues.waterppm
    //   );

    //   // Add formatted averages and errors
    //   csvContent += `Average Water Temperature,${avgWaterTemp.toFixed(
    //     2
    //   )} Celsius,Error,${avgWaterTempError}%\n`;
    //   csvContent += `Average Water pH,${avgWaterPh.toFixed(
    //     2
    //   )},Error,${avgWaterPhError}%\n`;
    //   csvContent += `Average Water PPM,${avgWaterPpm.toFixed(
    //     2
    //   )},Error,${avgWaterPpmError}%\n\n`;

    //   // Add date range if filtering is active
    //   if (startDate && endDate) {
    //     csvContent += `Date Range,${startDate} to ${endDate}\n`;
    //   }
    // }

    // Create and trigger download with proper encoding
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
      const filename = selectedProfile
        ? `monitoring_data_${profileName.replace(/\s+/g, "_")}_${timestamp}.csv`
        : `monitoring_data_${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
        username={username}
      />

      <div className="content flex-grow-1 p-3">
        <Typography
          variant="h4"
          gutterBottom
          className="fw-bold text-success mb-4"
        >
          Monitoring History
        </Typography>

        <HistoryFilter
          startDate={startDate}
          endDate={endDate}
          handleDateChange={handleDateChange}
          isFiltering={isFiltering}
          handleClearFilter={handleClearFilter}
          profiles={profiles}
          selectedProfile={selectedProfile}
          handleProfileChange={handleProfileChange}
          exportToCSV={exportToCSV}
        />

        <HistoryTable
          monitoringData={monitoringData}
          selectedProfile={selectedProfile}
          targetValues={targetValues}
          page={page}
          rowsPerPage={rowsPerPage}
          calculateError={calculateError}
        />

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(monitoringData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="secondary-emphasis"
          />
        </Box>
      </div>
    </div>
  );
};

export default History;
