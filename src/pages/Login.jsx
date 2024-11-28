/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken, removeAuthToken, isTokenExpired } from "../utils/auth";
import { Box, TextField, Typography, Alert, Container, ThemeProvider} from "@mui/material";
import {
  registerTheme,
  LoginBox,
  LoginCard,
  LoginCardContent,
  LoginButton,
  LoginLink,
} from "../styles/styledComponents";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        handleLogout();
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        username,
        password,
      });

      if (response.data.token) {
        setAuthToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      if (!error.response) {
        setError("Failed connect to server");
      } else {
        setError(error.response.data.error || "An Error occurred");
      }
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <ThemeProvider theme={registerTheme}>
      <LoginBox>
        <Container maxWidth="sm">
          <LoginCard>
            <LoginCardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={4}
              >
                <Box
                  component="img"
                  src="/icon.svg"
                  alt="Taman Herbal Lawu"
                  sx={{
                    width: "80px",
                    height: "auto",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "#4CAF50",
                  }}
                >
                  Taman Herbal Lawu
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <LoginButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  Login
                </LoginButton>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Forgot password or need an account?
                    <br />
                    <LoginLink href="/contact-admin">Contact admin</LoginLink>
                  </Typography>
                </Box>
              </Box>
            </LoginCardContent>
          </LoginCard>
        </Container>
      </LoginBox>
    </ThemeProvider>
  );
};

export default Login;
