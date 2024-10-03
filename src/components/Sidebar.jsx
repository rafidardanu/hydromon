/* eslint-disable react/prop-types */
import { useState, forwardRef } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  TrendingUp as AccuracyIcon,
  PersonAdd as RegisterIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import "./assets/Sidebar.css";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LogoutDialog = ({ open, handleClose, handleConfirm }) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>{"Confirm Logout"}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        <WarningIcon sx={{ color: "orange", mr: 1, verticalAlign: "middle" }} />
        Are you sure you want to log out?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleConfirm} color="primary" autoFocus>
        Logout
      </Button>
    </DialogActions>
  </Dialog>
);

const Sidebar = ({ activePage, handleNavigation, handleLogout, username }) => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    closeLogoutDialog();
    handleLogout();
  };

  const menuItems = [
    { name: "dashboard", icon: DashboardIcon, label: "Dashboard" },
    { name: "accuracy", icon: AccuracyIcon, label: "Accuracy" },
    { name: "history", icon: HistoryIcon, label: "History" },
    { name: "employee", icon: PeopleIcon, label: "Employee" }
  ];

  // Add Employee menu item for admin only
  if (user.role === "admin") {
    menuItems.push({ name: "register", icon: RegisterIcon, label: "Register" });
  }

  return (
    <div
      className="sidebar text-white p-3 d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div className="user-info text-center mb-4">
        <Avatar
          alt="Logo"
          src="/icon.svg"
          className="mx-auto mb-2"
          sx={{ width: 80, height: 80 }}
        />
        <h4>{username}</h4>
        <p className="fst-italic">
          {user.role === "admin" ? "Admin" : "Farmer"}
        </p>
      </div>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => handleNavigation(item.name)}
            className={`text-white list-item-vertical ${
              activePage === item.name ? "active" : ""
            }`}
          >
            <ListItemIcon className="ps-2">
              <item.icon sx={{ color: "white", fontSize: 40 }} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <div style={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 2 }} />

      <List>
        <ListItem
          button
          onClick={openLogoutDialog}
          className="text-white list-item-vertical"
        >
          <ListItemIcon className="ps-2">
            <LogoutIcon sx={{ color: "white", fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>

      <LogoutDialog
        open={logoutDialogOpen}
        handleClose={closeLogoutDialog}
        handleConfirm={confirmLogout}
      />
    </div>
  );
};

export default Sidebar;
