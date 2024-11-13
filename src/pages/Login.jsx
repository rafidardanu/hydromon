/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setAuthToken, removeAuthToken, isTokenExpired } from "../utils/auth";
import "./assets/LoginRegister.css";

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
    const intervalId = setInterval(checkTokenExpiration, 60000); // check every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });
      if (response.data.token) {
        setAuthToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("Login successful", response.data);
        setError("");
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div id="login" className="d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img
                    src="/icon.svg"
                    alt="Taman Herbal Lawu"
                    className="mb-3"
                    style={{ width: "80px" }}
                  />
                  <h2 className="fw-bold text-primary">Taman Herbal Lawu</h2>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Login
                  </button>
                  <div className="text-center">
                    <p className="mt-3 mb-0">
                      Forgot password or need an account? <br />
                      <Link
                        to="/contact-admin"
                        className="text-decoration-none"
                      >
                        Contact admin
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
