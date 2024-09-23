import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./assets/Dashboard.css";

export const History = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("history");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
        username={username}
      />

      {/* Main Content */}
      <div className="content flex-grow-1 p-2">
        <h1>History Content</h1>
      </div>
    </div>
  );
};

export default History;
