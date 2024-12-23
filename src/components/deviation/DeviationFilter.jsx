/* eslint-disable react/prop-types */
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { BarChart3 } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

const DeviationFilter = ({
  profiles,
  selectedProfile,
  startDate,
  endDate,
  loading,
  selectedProfileId,
  handleProfileChange,
  handleDateChange,
  fetchErrorData,
}) => {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Select Profile</InputLabel>
          <Select
            value={selectedProfile}
            label="Select Profile"
            onChange={handleProfileChange}
            disabled={loading}
          >
            {profiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.profile}>
                {profile.profile}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          id="startDate"
          label="Start Date"
          type="date"
          fullWidth
          value={startDate}
          onChange={(event) => handleDateChange(event, "start")}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ max: today }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          id="endDate"
          label="End Date"
          type="date"
          fullWidth
          value={endDate}
          onChange={(event) => handleDateChange(event, "end")}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: today,
            min: startDate,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          variant="contained"
          color="success"
          className="p-3"
          fullWidth
          onClick={fetchErrorData}
          disabled={loading || !selectedProfileId || !startDate || !endDate}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <BarChart3 size={24} />
              Calculate
            </>
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeviationFilter;
