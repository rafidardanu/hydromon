/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Pagination } from "@mui/material";
import Sidebar from "../components/Sidebar";
import EmployeeTable from "../components/employee/EmployeeTable";
import EditEmployeeDialog from "../components/employee/EditEmployeeDialog";
import DeleteEmployeeDialog from "../components/employee/DeleteEmployeeDialog";
import { isTokenExpired, removeAuthToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Employee = () => {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [activePage, setActivePage] = useState("employee");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(9);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      if (user && user.username) {
        setUsername(user.username);
        await fetchEmployees(token);
      } else {
        navigate("/login");
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditingEmployee(null);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/employees/${editingEmployee.id}`,
        {
          fullname: editingEmployee.fullname,
          email: editingEmployee.email,
          telephone: editingEmployee.telephone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === "Employee updated successfully") {
        await fetchEmployees(token);
        handleEditClose();
      }
    } catch (error) {
      console.error(
        "Error updating employee:",
        error.response ? error.response.data : error.message
      );
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleDeleteClick = (employee) => {
    setDeletingEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeletingEmployee(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/api/employees/${deletingEmployee.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchEmployees(token);
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting employee:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard d-flex">
      <Sidebar
        activePage={activePage}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
        username={username}
      />

      <div className="content flex-grow-1 p-3">
        <Typography variant="h4" gutterBottom className="fw-bold text-success">
          Employee Directory
        </Typography>

        <EmployeeTable
          employees={filteredEmployees}
          page={page}
          rowsPerPage={rowsPerPage}
          userRole={user?.role}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredEmployees.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="secondary-emphasis"
            className="custom-pagination"
          />
        </Box>

        <EditEmployeeDialog
          open={openEditDialog}
          employee={editingEmployee}
          onClose={handleEditClose}
          onSave={handleEditSave}
          onChangeEmployee={setEditingEmployee}
        />

        <DeleteEmployeeDialog
          open={openDeleteDialog}
          employee={deletingEmployee}
          onClose={handleDeleteClose}
          onConfirmDelete={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default Employee;