/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
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
import { CHART_COLORS, ACCURACY_COLORS } from "../utils/constants";
import { styled } from "@mui/material/styles";
import Sidebar from "../components/Sidebar";
import { isTokenExpired, removeAuthToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DataSetpoint = styled(Card)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: theme.palette.common.white,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const AccuracyCard = styled(Card)(({ theme, accuracy }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  height: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  border: `2px solid ${getAccuracyColor(accuracy)}`,
}));

const getAccuracyColor = (accuracy) => {
  const value = parseFloat(accuracy);
  if (value >= 90) return ACCURACY_COLORS.high;
  if (value >= 80) return ACCURACY_COLORS.medium;
  return ACCURACY_COLORS.low;
};

export const Accuracy = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("accuracy");
  const [username, setUsername] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [targetValues, setTargetValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [accuracyData, setAccuracyData] = useState([]);
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

 const fetchAccuracyData = async () => {
   try {
     setLoading(true);
     const token = localStorage.getItem("token");

     if (!token || isTokenExpired(token)) {
       handleLogout();
       return;
     }

     const response = await axios.get(
       `${API_BASE_URL}/api/accuracy?startDate=${startDate}&endDate=${endDate}&profileId=${selectedProfileId}`,
       {
         headers: { Authorization: `Bearer ${token}` },
       }
     );
     setAccuracyData(response.data);
   } catch (error) {
     console.error("Error fetching accuracy data:", error);
     if (error.response?.status === 401) {
       handleLogout();
     }
   } finally {
     setLoading(false);
   }
 };

  const handleLogout = () => {
    // localStorage.removeItem("token");
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
    return accuracyData.slice(startIndex, endIndex);
  };

  const calculateAverageAccuracy = (data) => {
    if (!data || data.length === 0) return 0;

    const totalAccuracy = data.reduce((acc, row) => {
      const tempAcc = parseFloat(row.watertemp_accuracy) || 0;
      const ppmAcc = parseFloat(row.waterppm_accuracy) || 0;
      const phAcc = parseFloat(row.waterph_accuracy) || 0;
      return acc + (tempAcc + ppmAcc + phAcc) / 3;
    }, 0);

    return (totalAccuracy / data.length).toFixed(2);
  };

  const calculateParameterAverage = (data, parameter) => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce(
      (acc, row) => acc + parseFloat(row[parameter]) || 0,
      0
    );
    return (total / data.length).toFixed(2);
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
          sx={{ fontWeight: "bold", color: "success.main", mb: 4 }}
        >
          Accuracy
        </Typography>
        <Grid container spacing={3}>
          {/* section kiri */}
          <Grid item xs={12} md={6} lg={9}>
            <Card sx={{p: 3 }}>
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
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="success"
                    className="p-3"
                    fullWidth
                    onClick={fetchAccuracyData}
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
              <Grid item container spacing={1}>
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
              <Grid item sx={{ mb: 4, p: 2 }}>
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
                      <Table aria-label="Accuracy Data">
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
                              Accuracy
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
                              Accuracy
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
                              Accuracy
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
                                    bgcolor: `${getAccuracyColor(
                                      row.watertemp_accuracy
                                    )}20`,
                                    color: getAccuracyColor(
                                      row.watertemp_accuracy
                                    ),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "full",
                                    fontWeight: "medium",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {row.watertemp_accuracy}%
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(row.avg_waterppm).toFixed(1)}
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor: `${getAccuracyColor(
                                      row.waterppm_accuracy
                                    )}20`,
                                    color: getAccuracyColor(
                                      row.waterppm_accuracy
                                    ),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "full",
                                    fontWeight: "medium",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {row.waterppm_accuracy}%
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(row.avg_waterph).toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    bgcolor: `${getAccuracyColor(
                                      row.waterph_accuracy
                                    )}20`,
                                    color: getAccuracyColor(
                                      row.waterph_accuracy
                                    ),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "full",
                                    fontWeight: "medium",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {row.waterph_accuracy}%
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

                    {accuracyData.length > 0 && (
                      <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                          count={Math.ceil(accuracyData.length / rowsPerPage)}
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
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Accuracy Summary
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : accuracyData.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <AccuracyCard
                      accuracy={calculateAverageAccuracy(accuracyData)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Overall Accuracy
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: getAccuracyColor(
                              calculateAverageAccuracy(accuracyData)
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {calculateAverageAccuracy(accuracyData)}%
                        </Typography>
                      </CardContent>
                    </AccuracyCard>
                  </Grid>

                  <Grid item xs={12}>
                    <AccuracyCard
                      accuracy={calculateParameterAverage(
                        accuracyData,
                        "watertemp_accuracy"
                      )}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Temperature Accuracy
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: getAccuracyColor(
                              calculateParameterAverage(
                                accuracyData,
                                "watertemp_accuracy"
                              )
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {calculateParameterAverage(
                            accuracyData,
                            "watertemp_accuracy"
                          )}
                          %
                        </Typography>
                      </CardContent>
                    </AccuracyCard>
                  </Grid>

                  <Grid item xs={12}>
                    <AccuracyCard
                      accuracy={calculateParameterAverage(
                        accuracyData,
                        "waterppm_accuracy"
                      )}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          PPM Accuracy
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: getAccuracyColor(
                              calculateParameterAverage(
                                accuracyData,
                                "waterppm_accuracy"
                              )
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {calculateParameterAverage(
                            accuracyData,
                            "waterppm_accuracy"
                          )}
                          %
                        </Typography>
                      </CardContent>
                    </AccuracyCard>
                  </Grid>

                  <Grid item xs={12}>
                    <AccuracyCard
                      accuracy={calculateParameterAverage(
                        accuracyData,
                        "waterph_accuracy"
                      )}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          pH Accuracy
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: getAccuracyColor(
                              calculateParameterAverage(
                                accuracyData,
                                "waterph_accuracy"
                              )
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {calculateParameterAverage(
                            accuracyData,
                            "waterph_accuracy"
                          )}
                          %
                        </Typography>
                      </CardContent>
                    </AccuracyCard>
                  </Grid>
                </Grid>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Select a profile and date range to view accuracy metrics
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Accuracy;
