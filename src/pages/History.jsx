// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Typography, Box, Pagination } from "@mui/material";
// import Sidebar from "../components/Sidebar";
// import HistoryTable from "../components/history/HistoryTable";
// import HistoryFilter from "../components/history/HistoryFilter";
// import { isTokenExpired, removeAuthToken } from "../utils/auth";
// import { format } from "date-fns";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const History = () => {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState("history");
//   const [username, setUsername] = useState("");
//   const [monitoringData, setMonitoringData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [rowsPerPage] = useState(16);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [isFiltering, setIsFiltering] = useState(false);
//   const [profiles, setProfiles] = useState([]);
//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [targetValues, setTargetValues] = useState({
//     watertemp: 0,
//     waterph: 0,
//     waterppm: 0,
//   });

//   useEffect(() => {
//     const checkAuthAndFetch = async () => {
//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user"));

//       if (!token || isTokenExpired(token)) {
//         handleLogout();
//         return;
//       }

//       if (user && user.username) {
//         setUsername(user.username);
//         await fetchProfiles(token);
//         if (isFiltering) {
//           await fetchFilteredData(token);
//         } else {
//           await fetchAllData(token);
//         }
//       } else {
//         navigate("/login");
//       }
//     };

//     checkAuthAndFetch();
//   }, [isFiltering, startDate, endDate, navigate]);

//   const calculateError = (measured, target) => {
//     const error = ((Math.abs(measured - target) / target) * 100).toFixed(2);
//     return error;
//   };

//   const fetchProfiles = async (token) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProfiles(response.data);
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     }
//   };

//   const handleProfileChange = (event) => {
//     const profileId = event.target.value;
//     setSelectedProfile(profileId);
//     const selectedProfileData = profiles.find((p) => p.id === profileId);
//     if (selectedProfileData) {
//       setTargetValues({
//         watertemp: selectedProfileData.watertemp,
//         waterph: selectedProfileData.waterph,
//         waterppm: selectedProfileData.waterppm,
//       });
//     }
//   };

//   const fetchAllData = async (token) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/history/monitoring`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const sortedData = response.data.sort(
//         (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
//       );
//       setMonitoringData(sortedData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response?.status === 401) {
//         handleLogout();
//       }
//     }
//   };

//   const fetchFilteredData = async (token) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/history/monitoring`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { startDate, endDate },
//         }
//       );
//       const sortedData = response.data.sort(
//         (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
//       );
//       setMonitoringData(sortedData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response?.status === 401) {
//         handleLogout();
//       }
//     }
//   };

//   const handleLogout = () => {
//     removeAuthToken();
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const handleNavigation = (page) => {
//     setActivePage(page);
//     navigate(`/${page}`);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleDateChange = (type, value) => {
//     setPage(1);
//     if (type === "start") {
//       setStartDate(value);
//     } else {
//       setEndDate(value);
//     }
//     setIsFiltering(type === "start" ? value && endDate : startDate && value);
//   };

//   const handleClearFilter = () => {
//     setStartDate("");
//     setEndDate("");
//     setIsFiltering(false);
//     setPage(1);
//   };

// const exportToCSV = () => {
//   const formatValue = (value) => {
//     if (value === null || value === undefined) return "N/A";
//     return value.toFixed(2);
//   };

//   const calculateAverages = (data) => {
//     const validData = {
//       watertemp: data.filter((item) => item.watertemp != null),
//       waterph: data.filter((item) => item.waterph != null),
//       waterppm: data.filter((item) => item.waterppm != null),
//     };

//     return {
//       avgWaterTemp: validData.watertemp.length
//         ? validData.watertemp.reduce((sum, item) => sum + item.watertemp, 0) /
//           validData.watertemp.length
//         : 0,
//       avgWaterPh: validData.waterph.length
//         ? validData.waterph.reduce((sum, item) => sum + item.waterph, 0) /
//           validData.waterph.length
//         : 0,
//       avgWaterPpm: validData.waterppm.length
//         ? validData.waterppm.reduce((sum, item) => sum + item.waterppm, 0) /
//           validData.waterppm.length
//         : 0,
//     };
//   };

//   const selectedProfileData = profiles.find((p) => p.id === selectedProfile);
//   const profileName = selectedProfileData?.profile || "No Profile Selected";
//   let csvContent = "\ufeff";

//   // Profile information
//   csvContent += "Profile Information\n\n";
//   csvContent += `Selected Profile,${profileName}\n\n`;

//   if (selectedProfile) {
//     csvContent += "Target Values\n";
//     csvContent += `Water Temperature,${formatValue(
//       targetValues.watertemp
//     )} °C\n`;
//     csvContent += `Water pH,${formatValue(targetValues.waterph)} pH\n`;
//     csvContent += `Water PPM,${formatValue(targetValues.waterppm)} ppm\n\n`;
//   }

//   // Headers
//   csvContent += "Measurement Data\n";
//   const headers = [
//     "Timestamp",
//     "Water Temperature (Celsius)",
//     selectedProfile && "Temperature Error (%)",
//     "Water pH",
//     selectedProfile && "pH Error (%)",
//     "Water PPM",
//     selectedProfile && "PPM Error (%)",
//     "Air Temperature (Celsius)",
//     "Air Humidity (%)",
//   ].filter(Boolean);
//   csvContent += headers.join(",") + "\n";

//   // Data rows
//   monitoringData.forEach((item) => {
//     const timestamp = item.timestamp
//       ? format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")
//       : "N/A";

//     const row = [
//       timestamp,
//       formatValue(item.watertemp),
//       selectedProfile &&
//         (item.watertemp != null
//           ? calculateError(item.watertemp, targetValues.watertemp)
//           : "N/A"),
//       formatValue(item.waterph),
//       selectedProfile &&
//         (item.waterph != null
//           ? calculateError(item.waterph, targetValues.waterph)
//           : "N/A"),
//       formatValue(item.waterppm),
//       selectedProfile &&
//         (item.waterppm != null
//           ? calculateError(item.waterppm, targetValues.waterppm)
//           : "N/A"),
//       formatValue(item.airtemp),
//       formatValue(item.airhum),
//     ].filter(Boolean);

//     csvContent += row.join(",") + "\n";
//   });

//   // Summary statistics
//   if (selectedProfile) {
//     const averages = calculateAverages(monitoringData);

//     csvContent += "\nSummary Statistics\n";
//     csvContent += `Average Water Temperature,${formatValue(
//       averages.avgWaterTemp
//     )} °C,Error,${
//       averages.avgWaterTemp
//         ? calculateError(averages.avgWaterTemp, targetValues.watertemp)
//         : "N/A"
//     }%\n`;
//     csvContent += `Average Water pH,${formatValue(averages.avgWaterPh)} pH,Error,${
//       averages.avgWaterPh
//         ? calculateError(averages.avgWaterPh, targetValues.waterph)
//         : "N/A"
//     }%\n`;
//     csvContent += `Average Water PPM,${formatValue(
//       averages.avgWaterPpm
//     )} ppm,Error,${
//       averages.avgWaterPpm
//         ? calculateError(averages.avgWaterPpm, targetValues.waterppm)
//         : "N/A"
//     }%\n\n`;

//     if (startDate && endDate) {
//       csvContent += `Date Range,${startDate} - ${endDate}\n`;
//     }
//   }

//   // Download
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
//   const filename = `monitoring_data_${
//     selectedProfile ? profileName.replace(/\s+/g, "_") + "_" : ""
//   }${timestamp}.csv`;

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };

//   return (
//     <div className="dashboard d-flex">
//       <Sidebar
//         activePage={activePage}
//         handleNavigation={handleNavigation}
//         handleLogout={handleLogout}
//         username={username}
//       />

//       <div className="content flex-grow-1 p-3">
//         <Typography
//           variant="h4"
//           gutterBottom
//           className="fw-bold text-success mb-4"
//         >
//           Monitoring History
//         </Typography>

//         <HistoryFilter
//           startDate={startDate}
//           endDate={endDate}
//           handleDateChange={handleDateChange}
//           isFiltering={isFiltering}
//           handleClearFilter={handleClearFilter}
//           profiles={profiles}
//           selectedProfile={selectedProfile}
//           handleProfileChange={handleProfileChange}
//           exportToCSV={exportToCSV}
//         />

//         <HistoryTable
//           monitoringData={monitoringData}
//           selectedProfile={selectedProfile}
//           targetValues={targetValues}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           calculateError={calculateError}
//         />

//         <Box display="flex" justifyContent="center" mt={4}>
//           <Pagination
//             count={Math.ceil(monitoringData.length / rowsPerPage)}
//             page={page}
//             onChange={handleChangePage}
//             color="secondary-emphasis"
//           />
//         </Box>
//       </div>
//     </div>
//   );
// };

// export default History;

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

  // const calculateError = (measured, target) => {
  //   const error = ((Math.abs(measured - target) / target) * 100).toFixed(2);
  //   return error;
  // };

 const calculateError = (measured, target) => {
   // Return absolute difference instead of percentage
   return Math.abs(measured - target).toFixed(2);
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
  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(2);
  };

  const calculateAverages = (data) => {
    const validData = {
      watertemp: data.filter((item) => item.watertemp != null),
      waterph: data.filter((item) => item.waterph != null),
      waterppm: data.filter((item) => item.waterppm != null),
    };

    return {
      avgWaterTemp: validData.watertemp.length
        ? validData.watertemp.reduce((sum, item) => sum + item.watertemp, 0) /
          validData.watertemp.length
        : 0,
      avgWaterPh: validData.waterph.length
        ? validData.waterph.reduce((sum, item) => sum + item.waterph, 0) /
          validData.waterph.length
        : 0,
      avgWaterPpm: validData.waterppm.length
        ? validData.waterppm.reduce((sum, item) => sum + item.waterppm, 0) /
          validData.waterppm.length
        : 0,
    };
  };

  const selectedProfileData = profiles.find((p) => p.id === selectedProfile);
  const profileName = selectedProfileData?.profile || "No Profile Selected";
  let csvContent = "\ufeff";

  // Profile information
  csvContent += "Profile Information\n\n";
  csvContent += `Selected Profile,${profileName}\n\n`;

  if (selectedProfile) {
    csvContent += "Target Values\n";
    csvContent += `Water Temperature,${formatValue(
      targetValues.watertemp
    )} °C\n`;
    csvContent += `Water pH,${formatValue(targetValues.waterph)} pH\n`;
    csvContent += `Water PPM,${formatValue(targetValues.waterppm)} ppm\n\n`;
  }

  // Headers
  csvContent += "Measurement Data\n";
  const headers = [
    "Timestamp",
    "Water Temperature (°C)",
    selectedProfile && "Temperature Error (±)",
    "Water pH",
    selectedProfile && "pH Error (±)",
    "Water PPM",
    selectedProfile && "PPM Error (±)",
    "Air Temperature (°C)",
    "Air Humidity (%)",
  ].filter(Boolean);
  csvContent += headers.join(",") + "\n";

  // Data rows
  monitoringData.forEach((item) => {
    const timestamp = item.timestamp
      ? format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")
      : "N/A";

    const row = [
      timestamp,
      formatValue(item.watertemp),
      selectedProfile &&
        (item.watertemp != null
          ? calculateError(item.watertemp, targetValues.watertemp)
          : "N/A"),
      formatValue(item.waterph),
      selectedProfile &&
        (item.waterph != null
          ? calculateError(item.waterph, targetValues.waterph)
          : "N/A"),
      formatValue(item.waterppm),
      selectedProfile &&
        (item.waterppm != null
          ? calculateError(item.waterppm, targetValues.waterppm)
          : "N/A"),
      formatValue(item.airtemp),
      formatValue(item.airhum),
    ].filter(Boolean);

    csvContent += row.join(",") + "\n";
  });

  // Summary statistics
  if (selectedProfile) {
    const averages = calculateAverages(monitoringData);

    csvContent += "\nSummary Statistics\n";
    csvContent += `Average Water Temperature,${formatValue(
      averages.avgWaterTemp
    )} °C,Error,±${
      averages.avgWaterTemp
        ? calculateError(averages.avgWaterTemp, targetValues.watertemp)
        : "N/A"
    }\n`;
    csvContent += `Average Water pH,${formatValue(
      averages.avgWaterPh
    )} pH,Error,±${
      averages.avgWaterPh
        ? calculateError(averages.avgWaterPh, targetValues.waterph)
        : "N/A"
    }\n`;
    csvContent += `Average Water PPM,${formatValue(
      averages.avgWaterPpm
    )} ppm,Error,±${
      averages.avgWaterPpm
        ? calculateError(averages.avgWaterPpm, targetValues.waterppm)
        : "N/A"
    }\n\n`;

    if (startDate && endDate) {
      csvContent += `Date Range,${startDate} - ${endDate}\n`;
    }
  }

  // Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
  const filename = `monitoring_data_${
    selectedProfile ? profileName.replace(/\s+/g, "_") + "_" : ""
  }${timestamp}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
