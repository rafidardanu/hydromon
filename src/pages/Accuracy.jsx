import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./assets/Dashboard.css";

export const Accuracy = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("accuracy");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
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
      />

      {/* Main Content */}
      <div className="content flex-grow-1 p-2">
        <h1>Accuracy Page</h1>
        <p>This is where you can display accuracy-related content.</p>
      </div>
    </div>
  );
};

export default Accuracy;
