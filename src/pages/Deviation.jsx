/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Grid, Card } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { isTokenExpired, removeAuthToken } from "../utils/auth";
import DeviationFilter from "../components/deviation/DeviationFilter";
import TargetCards from "../components/deviation/TargetCards";
import DeviationTable from "../components/deviation/DeviationTable";
import PerformanceMetrics from "../components/deviation/PerformanceMetrics";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Deviation = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("deviation");
  const [username, setUsername] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [targetValues, setTargetValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorData, setErrorData] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(7);

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
      } else {
        navigate("/login");
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const fetchProfiles = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const profile = event.target.value;
    const selectedProfileData = profiles.find((p) => p.profile === profile);
    setSelectedProfile(profile);
    setSelectedProfileId(selectedProfileData.id);
    setTargetValues(selectedProfileData);
    setPage(1);
  };

  const handleDateChange = (event, type) => {
    if (type === "start") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
    setPage(1);
  };

  const fetchErrorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/deviation?startDate=${startDate}&endDate=${endDate}&profileId=${selectedProfileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setErrorData(response.data);
    } catch (error) {
      console.error("Error fetching error data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
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

  const getCurrentPageData = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return errorData.slice(startIndex, endIndex);
  };

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
        username={username}
      />
      <Box className="content flex-grow-1 p-3">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "success.main", mb: 2 }}
        >
          Deviation
        </Typography>
        <Grid container spacing={2}>
          {/* Left section */}
          <Grid item xs={12} md={6} lg={9}>
            <Card sx={{ p: 3 }}>
              <DeviationFilter
                profiles={profiles}
                selectedProfile={selectedProfile}
                startDate={startDate}
                endDate={endDate}
                loading={loading}
                selectedProfileId={selectedProfileId}
                handleProfileChange={handleProfileChange}
                handleDateChange={handleDateChange}
                fetchErrorData={fetchErrorData}
              />
              <TargetCards loading={loading} targetValues={targetValues} />
              <DeviationTable
                loading={loading}
                getCurrentPageData={getCurrentPageData}
                targetValues={targetValues}
                errorData={errorData}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
              />
            </Card>
          </Grid>
          {/* Right section */}
          <Grid item xs={12} md={6} lg={3}>
            <PerformanceMetrics loading={loading} errorData={errorData} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Deviation;
