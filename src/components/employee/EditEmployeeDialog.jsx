/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditEmployeeDialog = ({
  open,
  employee,
  onClose,
  onSave,
  onChangeEmployee,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Full Name"
          type="text"
          fullWidth
          value={employee?.fullname || ""}
          onChange={(e) =>
            onChangeEmployee({
              ...employee,
              fullname: e.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={employee?.email || ""}
          onChange={(e) =>
            onChangeEmployee({
              ...employee,
              email: e.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          label="Telephone"
          type="tel"
          fullWidth
          value={employee?.telephone || ""}
          onChange={(e) =>
            onChangeEmployee({
              ...employee,
              telephone: e.target.value,
            })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary-emphasis">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;
