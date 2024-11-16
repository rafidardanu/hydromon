// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Typography,
//   Box,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Card,
//   CardContent,
//   CircularProgress,
//   TextField,
// } from "@mui/material";
// import { CHART_COLORS } from "../utils/constants";
// import { styled } from "@mui/material/styles";
// import Sidebar from "../components/Sidebar";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const StyledCard = styled(Card)(({ theme }) => ({
//   transition: "transform 0.3s ease-in-out",
//   "&:hover": {
//     transform: "scale(1.03)",
//     boxShadow: theme.shadows[8],
//   },
// }));

// const DataSetpoint = styled(Card)(({ theme, bgcolor }) => ({
//   backgroundColor: bgcolor,
//   color: theme.palette.common.white,
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-5px)",
//     boxShadow: theme.shadows[8],
//   },
// }));

// export const Accuracy = () => {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState("accuracy");
//   const [username, setUsername] = useState("");
//   const [profiles, setProfiles] = useState([]);
//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [targetValues, setTargetValues] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user.username) {
//       setUsername(user.username);
//       fetchProfiles();
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const fetchProfiles = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${API_BASE_URL}/setpoint`, {
//         headers: { Authorization: token },
//       });
//       setProfiles(response.data);
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileChange = (event) => {
//     const profile = event.target.value;
//     setSelectedProfile(profile);
//     const selectedProfileData = profiles.find((p) => p.profile === profile);
//     setTargetValues(selectedProfileData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const handleNavigation = (page) => {
//     setActivePage(page);
//     navigate(`/${page}`);
//   };

//   return (
//     <div className="dashboard d-flex">
//       <Sidebar
//         activePage={activePage}
//         handleNavigation={handleNavigation}
//         handleLogout={handleLogout}
//         username={username}
//       />
//       <Box className="content flex-grow-1 p-3">
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{ fontWeight: "bold", color: "success.main", mb: 4 }}
//         >
//           Accuracy
//         </Typography>
//         <Grid container spacing={3} sx={{ mb: 2 }}>
//           <Grid item xs={12} md={6} lg={8}>
//             <StyledCard sx={{ mb: 4, p: 2 }}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth>
//                     <InputLabel>Select Profile</InputLabel>
//                     <Select
//                       value={selectedProfile}
//                       label="Select Profile"
//                       onChange={handleProfileChange}
//                       disabled={loading}
//                     >
//                       {profiles.map((profile) => (
//                         <MenuItem key={profile.id} value={profile.profile}>
//                           {profile.profile}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item>
//                   <TextField
//                     id="startDate"
//                     type="date"
//                     label="Start Date"
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>
//                 <Grid item>
//                   <TextField
//                     id="endDate"
//                     label="End Date"
//                     type="date"
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>

//                 <Grid item container spacing={1}>
//                   {loading ? (
//                     <Grid item xs={12}>
//                       <Box display="flex" justifyContent="center" my={4}>
//                         <CircularProgress />
//                       </Box>
//                     </Grid>
//                   ) : (
//                     targetValues && (
//                       <>
//                         <Grid item xs={12} md={4}>
//                           <DataSetpoint bgcolor={CHART_COLORS.watertemp}>
//                             <CardContent>
//                               <Typography variant="h5" gutterBottom>
//                                 Water Temperature
//                               </Typography>
//                               <Typography variant="h4">
//                                 {targetValues.watertemp.toFixed(1)}°C
//                               </Typography>
//                             </CardContent>
//                           </DataSetpoint>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <DataSetpoint bgcolor={CHART_COLORS.waterppm}>
//                             <CardContent>
//                               <Typography variant="h5" gutterBottom>
//                                 Water PPM
//                               </Typography>
//                               <Typography variant="h4">
//                                 {targetValues.waterppm.toFixed(1)}
//                               </Typography>
//                             </CardContent>
//                           </DataSetpoint>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <DataSetpoint bgcolor={CHART_COLORS.waterph}>
//                             <CardContent>
//                               <Typography variant="h5" gutterBottom>
//                                 Water pH
//                               </Typography>
//                               <Typography variant="h4">
//                                 {targetValues.waterph.toFixed(1)}
//                               </Typography>
//                             </CardContent>
//                           </DataSetpoint>
//                         </Grid>
//                       </>
//                     )
//                   )}
//                 </Grid>
//               </Grid>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} md={6} lg={4}>
//             <Box sx={{ position: "relative" }}></Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </div>
//   );
// };

// export default Accuracy;
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { CHART_COLORS } from "../utils/constants";
import { styled } from "@mui/material/styles";
import Sidebar from "../components/Sidebar";

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
      fetchProfiles();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/setpoint`, {
        headers: { Authorization: token },
      });
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
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
  };

  const handleDateChange = (event, type) => {
    if (type === "start") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const fetchAccuracyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/accuracy?startDate=${startDate}&endDate=${endDate}&profileId=${selectedProfileId}`,
        {
          headers: { Authorization: token },
        }
      );
      setAccuracyData(response.data);
    } catch (error) {
      console.error("Error fetching accuracy data:", error);
    } finally {
      setLoading(false);
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

  const getAccuracyColor = (accuracy) => {
    const value = parseFloat(accuracy);
    if (value >= 90) return "#4CAF50"; // green
    if (value >= 80) return "#FF9800"; // orange
    return "#F44336"; // red
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
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ mb: 4, p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                <Grid item>
                  <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(event) => handleDateChange(event, "start")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="endDate"
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(event) => handleDateChange(event, "end")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchAccuracyData}
                    disabled={
                      loading || !selectedProfileId || !startDate || !endDate
                    }
                  >
                    View Accuracy Data
                  </Button>
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
                                Target Water Temperature
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
              </Grid>
              <Grid item sx={{ mb: 4, p: 2 }}>
                {loading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : (
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
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Avg Water Temp (°C)
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Temp Accuracy
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Avg Water PPM
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            PPM Accuracy
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Avg Water pH
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            pH Accuracy
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Avg Air Temp (°C)
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Avg Air Humidity (%)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accuracyData.map((row, index) => (
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
                                  color: getAccuracyColor(row.waterph_accuracy),
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
                )}
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}></Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Accuracy;