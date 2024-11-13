/* eslint-disable no-unused-vars */
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Sidebar from "../components/Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// Styled Export Button
const ExportButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "white",
  "&:hover": {
    backgroundColor: "#45a049",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  padding: "8px 20px",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "15px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
}));

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (isFiltering) {
      fetchFilteredData();
    } else {
      fetchAllData();
    }
  }, [isFiltering, startDate, endDate]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/history/monitoring`, {
        headers: { Authorization: token },
      });
      setMonitoringData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFilteredData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/history/monitoring`, {
        headers: { Authorization: token },
        params: { startDate, endDate },
      });
      setMonitoringData(response.data);
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
    // Only set filtering to true if both dates are selected
    setIsFiltering(type === "start" ? value && endDate : startDate && value);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFiltering(false);
    setPage(1);
  };

  const exportToCSV = () => {
    let csvContent =
      "Timestamp,Water Temp (°C),Water pH,Water PPM,Air Temp (°C),Air Humidity (%)\n";

    monitoringData.forEach((item) => {
      const row = `${format(
        new Date(item.timestamp),
        "yyyy-MM-dd HH:mm:ss"
      )},${item.watertemp.toFixed(2)},${item.waterph.toFixed(
        2
      )},${item.waterppm.toFixed(2)},${item.airtemp.toFixed(
        2
      )},${item.airhum.toFixed(2)}`;
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "monitoring_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

        <Box
          display="flex"
          alignItems="center"
          mb={3}
          sx={{
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            display="flex"
            gap={2}
            sx={{
              flexGrow: 1,
              flexBasis: "300px",
              flexWrap: "wrap",
            }}
          >
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => handleDateChange("start", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: "200px" }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => handleDateChange("end", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: "200px" }}
            />
            {isFiltering && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFilter}
              >
                Clear Filter
              </Button>
            )}
          </Box>
          <ExportButton onClick={exportToCSV} startIcon={<FileDownloadIcon />}>
            Export to CSV
          </ExportButton>
        </Box>

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
