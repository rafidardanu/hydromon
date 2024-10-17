import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Pagination,
  TextField,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import Sidebar from "../components/Sidebar";

// Styled components for table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  background: "#4CAF50",
  color: theme.palette.common.white,
  fontSize: 16,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transform: "scale(1.01)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}));

const History = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("history");
  const [username, setUsername] = useState("");
  const [monitoringData, setMonitoringData] = useState([]);
  const [actuatorData, setActuatorData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(16);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
      fetchData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const monitoringResponse = await axios.get(
        "http://localhost:5000/api/history/monitoring",
        {
          headers: { Authorization: token },
          params: { startDate, endDate },
        }
      );
      setMonitoringData(monitoringResponse.data);

      const actuatorResponse = await axios.get(
        "http://localhost:5000/api/history/actuator",
        {
          headers: { Authorization: token },
          params: { startDate, endDate },
        }
      );
      setActuatorData(actuatorResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const exportToCSV = () => {
    const data = tabValue === 0 ? monitoringData : actuatorData;
    const filename =
      tabValue === 0 ? "monitoring_data.csv" : "actuator_data.csv";

    let csvContent = "";

    // Add headers
    if (tabValue === 0) {
      csvContent =
        "Timestamp,Water Temp (°C),Water pH,Water PPM,Air Temp (°C),Air Humidity (%)\n";
    } else {
      csvContent =
        "Timestamp,Nutrisi,pH Up,pH Down,Air Baku,Pompa Utama 1,Pompa Utama 2\n";
    }

    // Add data rows
    data.forEach((item) => {
      const row =
        tabValue === 0
          ? `${format(
              new Date(item.timestamp),
              "yyyy-MM-dd HH:mm:ss"
            )},${item.watertemp.toFixed(2)},${item.waterph.toFixed(
              2
            )},${item.waterppm.toFixed(2)},${item.airtemp.toFixed(
              2
            )},${item.airhum.toFixed(2)}`
          : `${format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")},${
              item.actuator_nutrisi ? "On" : "Off"
            },${item.actuator_ph_up ? "On" : "Off"},${
              item.actuator_ph_down ? "On" : "Off"
            },${item.actuator_air_baku ? "On" : "Off"},${
              item.actuator_pompa_utama_1 ? "On" : "Off"
            },${item.actuator_pompa_utama_2 ? "On" : "Off"}`;
      csvContent += row + "\n";
    });

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderMonitoringTable = () => (
    <TableContainer
      component={Paper}
      elevation={6}
      style={{ borderRadius: 15 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Timestamp</StyledTableCell>
            <StyledTableCell>Water Temp (°C)</StyledTableCell>
            <StyledTableCell>Water pH</StyledTableCell>
            <StyledTableCell>Water PPM</StyledTableCell>
            <StyledTableCell>Air Temp (°C)</StyledTableCell>
            <StyledTableCell>Air Humidity (%)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monitoringData
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((item, index) => (
              <StyledTableRow key={index}>
                <TableCell>
                  {format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{item.watertemp.toFixed(2)}</TableCell>
                <TableCell>{item.waterph.toFixed(2)}</TableCell>
                <TableCell>{item.waterppm.toFixed(2)}</TableCell>
                <TableCell>{item.airtemp.toFixed(2)}</TableCell>
                <TableCell>{item.airhum.toFixed(2)}</TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderActuatorTable = () => (
    <TableContainer
      component={Paper}
      elevation={6}
      style={{ borderRadius: 15 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Timestamp</StyledTableCell>
            <StyledTableCell>Nutrisi</StyledTableCell>
            <StyledTableCell>pH Up</StyledTableCell>
            <StyledTableCell>pH Down</StyledTableCell>
            <StyledTableCell>Air Baku</StyledTableCell>
            <StyledTableCell>Pompa Utama 1</StyledTableCell>
            <StyledTableCell>Pompa Utama 2</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actuatorData
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((item, index) => (
              <StyledTableRow key={index}>
                <TableCell>
                  {format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{item.actuator_nutrisi ? "On" : "Off"}</TableCell>
                <TableCell>{item.actuator_ph_up ? "On" : "Off"}</TableCell>
                <TableCell>{item.actuator_ph_down ? "On" : "Off"}</TableCell>
                <TableCell>{item.actuator_air_baku ? "On" : "Off"}</TableCell>
                <TableCell>
                  {item.actuator_pompa_utama_1 ? "On" : "Off"}
                </TableCell>
                <TableCell>
                  {item.actuator_pompa_utama_2 ? "On" : "Off"}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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

        <Box display="flex" alignItems="center" mb={3}>
          <Box display="flex" gap={2}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Button
            variant="contained"
            color="success"
            className="ms-3"
            onClick={handleDateFilter}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="ms-3"
            onClick={exportToCSV}
          >
            Export to CSV
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Monitoring Data" />
          <Tab label="Actuator Data" />
        </Tabs>

        <Box mt={3}>
          {tabValue === 0 ? renderMonitoringTable() : renderActuatorTable()}
        </Box>

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(
              (tabValue === 0 ? monitoringData.length : actuatorData.length) /
                rowsPerPage
            )}
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
