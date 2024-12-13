/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  ThemeProvider,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import { isTokenExpired, removeAuthToken } from "../utils/auth";
import {
  registerTheme,
  RegisterCard,
  RegisterButton,
} from "../styles/styledComponents";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddUser = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    gender: "",
    email: "",
    telephone: "",
    password: "",
    role: "farmer",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activePage, setActivePage] = useState("register");
  const navigate = useNavigate();

  // Add useEffect for authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || isTokenExpired(token) || !user) {
        handleLogout();
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Registration successful", response.data);
      setError("");
      navigate("/employee");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={registerTheme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
        <Sidebar
          activePage={activePage}
          handleNavigation={handleNavigation}
          handleLogout={handleLogout}
        />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="md" sx={{ py: 5 }}>
            <RegisterCard elevation={3}>
              <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Avatar
                  src="/icon.svg"
                  alt="Taman Herbal Lawu"
                  sx={{
                    width: 105,
                    height: 79,
                  }}
                />

                <Typography
                  className="mb-3"
                  variant="h4"
                  color="primary"
                  fontWeight="bold"
                >
                  Register New User
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="farmer">Farmer</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                {error && (
                  <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                  </Alert>
                )}

                <RegisterButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Register
                </RegisterButton>
              </Box>
            </RegisterCard>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AddUser;
