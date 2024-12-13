/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart3, CheckCircle2, XCircle, AlarmClockOff } from "lucide-react";
import {
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import {DataSetpoint, DeviationCard} from "../styles/styledComponents"
import Sidebar from "../components/Sidebar";
import { isTokenExpired, removeAuthToken } from "../utils/auth";
import {
  CHART_COLORS,
  DEVIATION_COLORS,
  ERROR_RANGES,
} from "../utils/constants";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const today = new Date().toISOString().split("T")[0];

const getErrorColor = (error, paramType) => {
  const value = Math.abs(parseFloat(error));
  const ranges = ERROR_RANGES[paramType] || ERROR_RANGES.temperature;

  if (value <= ranges.high) return DEVIATION_COLORS.high;
  if (value <= ranges.medium) return DEVIATION_COLORS.medium;
  return DEVIATION_COLORS.low;
};

const getErrorIcon = (error, paramType) => {
  const value = Math.abs(parseFloat(error));
  const ranges = ERROR_RANGES[paramType] || ERROR_RANGES.temperature;

  if (value <= ranges.high)
    return <CheckCircle2 color={DEVIATION_COLORS.high} />;
  if (value <= ranges.medium)
    return <AlarmClockOff color={DEVIATION_COLORS.medium} />;
  return <XCircle color={DEVIATION_COLORS.low} />;
};

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
  
  const calculateError = (measured, target) => {
    // Return absolute difference instead of percentage
    return Math.abs(measured - target).toFixed(2);
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

const calculateAverageError = (data) => {
  if (!data || data.length === 0) return 0;

  const tempErrors = data.map((row) =>
    calculateError(row.avg_watertemp, targetValues.watertemp)
  );
  const ppmErrors = data.map((row) =>
    calculateError(row.avg_waterppm, targetValues.waterppm)
  );
  const phErrors = data.map((row) =>
    calculateError(row.avg_waterph, targetValues.waterph)
  );

  const avgTempError =
    tempErrors.reduce((sum, error) => sum + parseFloat(error), 0) /
    tempErrors.length;
  const avgPpmError =
    ppmErrors.reduce((sum, error) => sum + parseFloat(error), 0) /
    ppmErrors.length;
  const avgPhError =
    phErrors.reduce((sum, error) => sum + parseFloat(error), 0) /
    phErrors.length;

  return ((avgTempError + avgPpmError + avgPhError) / 3).toFixed(2);
};

const calculateParameterAverage = (data, parameter) => {
  if (!data || data.length === 0) return 0;

  // Mapping parameter ke fungsi perhitungan kesalahan yang sesuai
  const errorCalculations = {
    watertemp_error: () =>
      data.map((row) =>
        calculateError(row.avg_watertemp, targetValues.watertemp)
      ),
    waterppm_error: () =>
      data.map((row) =>
        calculateError(row.avg_waterppm, targetValues.waterppm)
      ),
    waterph_error: () =>
      data.map((row) => calculateError(row.avg_waterph, targetValues.waterph)),
  };

  // Jika parameter tidak valid, kembalikan 0
  if (!errorCalculations[parameter]) return 0;

  // Hitung rata-rata kesalahan
  const errors = errorCalculations[parameter]();
  const avgError =
    errors.reduce((sum, error) => sum + parseFloat(error), 0) / errors.length;

  return avgError.toFixed(2);
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
          {/* section kiri */}
          <Grid item xs={12} md={6} lg={9}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Select Profile</InputLabel>
                    <Select
                      value={selectedProfile}
                      label="Select Profile"
                      onChange={handleProfileChange}
                      disabled={loading}
                    >
                      {profiles.map((profile) => (
                        <MenuItem key={profile.id} value={profile.profile}>
                          {profile.profile}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(event) => handleDateChange(event, "start")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ max: today }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    id="endDate"
                    label="End Date"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(event) => handleDateChange(event, "end")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: today,
                      min: startDate,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="success"
                    className="p-3"
                    fullWidth
                    onClick={fetchErrorData}
                    disabled={
                      loading || !selectedProfileId || !startDate || !endDate
                    }
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <BarChart3 size={24} />
                        Calculate
                      </>
                    )}
                  </Button>
                </Grid>
              </Grid>
              <Grid item container spacing={1} mb={3}>
                {loading ? (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" my={4}>
                      <CircularProgress />
                    </Box>
                  </Grid>
                ) : (
                  targetValues && (
                    <>
                      <Grid item xs={12} md={4}>
                        <DataSetpoint bgcolor={CHART_COLORS.watertemp}>
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              Target Water Temp
                            </Typography>
                            <Typography variant="h4">
                              {targetValues.watertemp.toFixed(1)}°C
                            </Typography>
                          </CardContent>
                        </DataSetpoint>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <DataSetpoint bgcolor={CHART_COLORS.waterppm}>
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              Target Water PPM
                            </Typography>
                            <Typography variant="h4">
                              {targetValues.waterppm.toFixed(1)}
                            </Typography>
                          </CardContent>
                        </DataSetpoint>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <DataSetpoint bgcolor={CHART_COLORS.waterph}>
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              Target Water pH
                            </Typography>
                            <Typography variant="h4">
                              {targetValues.waterph.toFixed(1)}
                            </Typography>
                          </CardContent>
                        </DataSetpoint>
                      </Grid>
                    </>
                  )
                )}
              </Grid>
              <Grid item>
                {loading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Table aria-label="Error Data">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Date
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Avg Water Temp
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Temp Error (±)
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Avg PPM
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              PPM Error (±)
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Avg pH
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              pH Error (±)
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Avg Air Temp
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Avg Humidity
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getCurrentPageData().map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:hover": { bgcolor: "grey.50" },
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {new Date(row.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(row.avg_watertemp).toFixed(1)}
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor: `${getErrorColor(
                                      calculateError(
                                        parseFloat(row.avg_watertemp),
                                        targetValues.watertemp
                                      ),
                                      "temperature"
                                    )}20`,
                                    color: getErrorColor(
                                      calculateError(
                                        parseFloat(row.avg_watertemp),
                                        targetValues.watertemp
                                      ),
                                      "temperature"
                                    ),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "full",
                                    fontWeight: "medium",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {calculateError(
                                    parseFloat(row.avg_watertemp),
                                    targetValues.watertemp
                                  )}
                                </Box>
                              </TableCell>

                              <TableCell align="right">
                                {parseFloat(row.avg_waterppm).toFixed(1)}
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor: `${getErrorColor(
                                      calculateError(
                                        parseFloat(row.avg_waterppm),
                                        targetValues.waterppm
                                      ),
                                      "ppm"
                                    )}20`,
                                    color: getErrorColor(
                                      calculateError(
                                        parseFloat(row.avg_waterppm),
                                        targetValues.waterppm
                                      ),
                                      "ppm"
                                    ),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "full",
                                    fontWeight: "medium",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {calculateError(
                                    parseFloat(row.avg_waterppm),
                                    targetValues.waterppm
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(row.avg_waterph).toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor: `${getErrorColor(
                                      calculateError(
                                        parseFloat(row.avg_waterph),
                                        targetValues.waterph
                                      ),
                                      "ph"
                                    )}20`,
                                    color: getErrorColor(
                                      calculateError(
                                        parseFloat(row.avg_waterph),
                                        targetValues.waterph
                                      ),
                                      "ph"
                                    ),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "full",
                                    fontWeight: "medium",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {calculateError(
                                    parseFloat(row.avg_waterph),
                                    targetValues.waterph
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(row.avg_airtemp).toFixed(1)}
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(row.avg_airhum).toFixed(1)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {errorData.length > 0 && (
                      <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                          count={Math.ceil(errorData.length / rowsPerPage)}
                          page={page}
                          onChange={handleChangePage}
                          color="secondary-emphasis"
                        />
                      </Box>
                    )}
                  </>
                )}
              </Grid>
            </Card>
          </Grid>
          {/* section kanan */}
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                mb: 4,
                p: 2,
                background: "linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)",
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  textAlign: "center",
                  mb: 3,
                }}
              >
                System Performance Metrics
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : errorData.length > 0 ? (
                <Grid container spacing={3}>
                  {[
                    {
                      label: "Overall Performance",
                      value: calculateAverageError(errorData),
                      description: "Comprehensive system measurement deviation",
                      isOverall: true,
                      unit: null,
                    },
                    {
                      label: "Temperature Error",
                      value: calculateParameterAverage(
                        errorData,
                        "watertemp_error"
                      ),
                      description:
                        "Average water temperature measurement deviation",
                      paramType: "temperature",
                      unit: "°C",
                    },
                    {
                      label: "PPM Error",
                      value: calculateParameterAverage(
                        errorData,
                        "waterppm_error"
                      ),
                      description:
                        "Average nutrient concentration measurement deviation",
                      paramType: "ppm",
                      unit: "ppm",
                    },
                    {
                      label: "pH Error",
                      value: calculateParameterAverage(
                        errorData,
                        "waterph_error"
                      ),
                      description:
                        "Average water acidity measurement deviation",
                      paramType: "ph",
                      unit: "pH",
                    },
                  ].map((metric, index) => (
                    <Grid item xs={12} key={index}>
                      {metric.isOverall ? (
                        // Special styling for Overall Performance card
                        <Card
                          sx={{
                            p: 2,
                            background:
                              "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            borderRadius: 2,
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Box flex={1}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "text.primary",
                                  }}
                                >
                                  {metric.label} (±)
                                </Typography>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    color: "text.primary",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {metric.value} {metric.unit || ""}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  {metric.description}
                                </Typography>
                              </Box>
                              <Box sx={{ ml: 2 }}>
                                <BarChart3 size={24} color="#666666" />
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ) : (
                        // Regular styling for parameter cards
                        <DeviationCard deviation={metric.value}>
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Box flex={1}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "text.secondary",
                                  }}
                                >
                                  {metric.label} (±)
                                </Typography>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    color: getErrorColor(
                                      metric.value,
                                      metric.paramType
                                    ),
                                    fontWeight: "bold",
                                  }}
                                >
                                  {metric.value} {metric.unit || ""}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  {metric.description}
                                </Typography>
                              </Box>
                              <Box sx={{ ml: 2 }}>
                                {getErrorIcon(metric.value, metric.paramType)}
                              </Box>
                            </Box>
                          </CardContent>
                        </DeviationCard>
                      )}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Select a profile and date range to view performance metrics
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Deviation;
