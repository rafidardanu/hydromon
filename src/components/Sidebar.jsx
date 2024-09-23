/* eslint-disable react/prop-types */
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  TrendingUp as AccuracyIcon,
} from "@mui/icons-material";
import "./assets/Sidebar.css";

const Sidebar = ({ activePage, handleNavigation, handleLogout }) => {
  return (
    <div
      className="sidebar text-white p-3 d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div className="user-info text-center mb-4">
        <Avatar
          alt="Logo"
          src="/icon.svg" // Update to use the logo
          className="mx-auto"
          sx={{ width: 80, height: 80 }}
        />
        <h5 className="mt-2">Nama User</h5>
      </div>

      <List>
        <ListItem
          button
          onClick={() => handleNavigation("dashboard")}
          className={`text-white list-item-vertical ${
            activePage === "dashboard" ? "active" : ""
          }`}
        >
          <ListItemIcon className="ps-2">
            <DashboardIcon sx={{ color: "white", fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          button
          onClick={() => handleNavigation("accuracy")}
          className={`text-white list-item-vertical ${
            activePage === "accuracy" ? "active" : ""
          }`}
        >
          <ListItemIcon className="ps-2">
            <AccuracyIcon sx={{ color: "white", fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Accuracy" />
        </ListItem>

        <ListItem
          button
          onClick={() => handleNavigation("history")}
          className={`text-white list-item-vertical ${
            activePage === "history" ? "active" : ""
          }`}
        >
          <ListItemIcon className="ps-2">
            <HistoryIcon sx={{ color: "white", fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>

        <ListItem
          button
          onClick={() => handleNavigation("employee")}
          className={`text-white list-item-vertical ${
            activePage === "employee" ? "active" : ""
          }`}
        >
          <ListItemIcon className="ps-2">
            <PeopleIcon sx={{ color: "white", fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Employee" />
        </ListItem>
      </List>

      <div style={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 2 }} />

      <List>
        <ListItem
          button
          onClick={handleLogout}
          className="text-white list-item-vertical"
        >
          <ListItemIcon className="ps-2">
            <LogoutIcon sx={{ color: "white", fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
