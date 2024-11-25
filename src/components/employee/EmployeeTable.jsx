/* eslint-disable react/prop-types */
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
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

const EmployeeTable = ({
  employees,
  page,
  rowsPerPage,
  userRole,
  onEditClick,
  onDeleteClick,
}) => {
  return (
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
            {userRole === "admin" && <StyledTableCell>Role</StyledTableCell>}
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees
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
                {userRole === "admin" && (
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
                      onClick={() => onEditClick(employee)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  {userRole === "admin" && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteClick(employee)}
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
  );
};

export default EmployeeTable;
