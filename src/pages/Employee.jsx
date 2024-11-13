import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Styled components for table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  background: "#4CAF50",
  color: theme.palette.common.white,
  fontSize: 16,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transform: "scale(1.01)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}));

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

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (user && user.username) {
      setUsername(user.username);
      fetchEmployees();
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
    const response = await axios.put(
      `${API_BASE_URL}/employees/${editingEmployee.id}`,
      {
        fullname: editingEmployee.fullname,
        email: editingEmployee.email,
        telephone: editingEmployee.telephone,
      },
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    if (response.data.message === "Employee updated successfully") {
      await fetchEmployees();
      handleEditClose();
    }
  } catch (error) {
    console.error(
      "Error updating employee:",
      error.response ? error.response.data : error.message
    );
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
      await axios.delete(
        `${API_BASE_URL}/employees/${deletingEmployee.id}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      await fetchEmployees();
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

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

        <TableContainer
          component={Paper}
          elevation={6}
          style={{ borderRadius: 15 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Employee</StyledTableCell>
                <StyledTableCell>Contact</StyledTableCell>
                {user.role === "admin" && (
                  <StyledTableCell>Role</StyledTableCell>
                )}
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((employee) => (
                  <StyledTableRow key={employee.id}>
                    <TableCell>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: "bold" }}
                        >
                          {employee.fullname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          @{employee.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" style={{ marginLeft: 8 }}>
                            {employee.email}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" style={{ marginLeft: 8 }}>
                            {employee.telephone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {user.role === "admin" && (
                      <TableCell>
                        <Chip
                          icon={
                            employee.role === "admin" ? (
                              <AdminIcon />
                            ) : (
                              <PersonIcon />
                            )
                          }
                          label={employee.role}
                          color={
                            employee.role === "admin" ? "secondary" : "primary"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(employee)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      {user.role === "admin" && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(employee)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredEmployees.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="secondary-emphasis"
            className="custom-pagination"
          />
        </Box>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditClose}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              value={editingEmployee?.fullname || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  fullname: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={editingEmployee?.email || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  email: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Telephone"
              type="tel"
              fullWidth
              value={editingEmployee?.telephone || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  telephone: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary-emphasis">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Do you really want to delete <b>{deletingEmployee?.fullname}</b>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="secondary-emphasis">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Employee;
