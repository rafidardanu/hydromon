import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setAuthToken, removeAuthToken, isTokenExpired } from "../utils/auth";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  styled,
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Custom styled components
const LoginBox = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #4CAF50, #45a049)",
  padding: "20px",
});

const StyledCard = styled(Card)({
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "500px",
  margin: "0 auto",
});

const StyledCardContent = styled(CardContent)({
  padding: "3rem !important",
  "@media (max-width: 600px)": {
    padding: "2rem !important",
  },
});

const StyledButton = styled(Button)({
  backgroundColor: "#4CAF50",
  "&:hover": {
    backgroundColor: "#45a049",
  },
  padding: "10px 0",
  marginTop: "16px",
  marginBottom: "16px",
});

const StyledLink = styled(Link)({
  color: "#4CAF50",
  textDecoration: "none",
  "&:hover": {
    color: "#45a049",
  },
});

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
      const response = await axios.post(`${API_BASE_URL}/login`, {
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
    <LoginBox>
      <Container maxWidth="sm">
        <StyledCard>
          <StyledCardContent>
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

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
              >
                Login
              </StyledButton>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Forgot password or need an account?
                  <br />
                  <StyledLink to="/contact-admin">Contact admin</StyledLink>
                </Typography>
              </Box>
            </Box>
          </StyledCardContent>
        </StyledCard>
      </Container>
    </LoginBox>
  );
};

export default Login;
