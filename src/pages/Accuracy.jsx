import React from "react";
import { useNavigate } from "react-router-dom";

export const Accuracy = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    navigate("/login");
  };

  return (
    <div>
      <h1>Accuracy</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Accuracy;
