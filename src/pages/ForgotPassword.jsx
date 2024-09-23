import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./assets/LoginRegister.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div id="forgot-password" className="d-flex align-items-center min-vh-100">
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
                  <h2 className="fw-bold text-primary">Forgot Password</h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {message && (
                    <div className="alert alert-success">{message}</div>
                  )}
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Reset Password
                  </button>
                  <div className="text-center">
                    <Link to="/login" className="text-decoration-none">
                      Back to Login
                    </Link>
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

export default ForgotPassword;
