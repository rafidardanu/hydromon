/* eslint-disable react/prop-types */
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const HistoryFilter = ({
  startDate,
  endDate,
  handleDateChange,
  isFiltering,
  handleClearFilter,
  profiles,
  selectedProfile,
  handleProfileChange,
  exportToCSV,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      mb={3}
      sx={{ gap: 2, flexWrap: "wrap" }}
    >
      <Box
        display="flex"
        gap={2}
        sx={{ flexGrow: 1, flexBasis: "300px", flexWrap: "wrap" }}
      >
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => handleDateChange("start", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: "200px" }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => handleDateChange("end", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: "200px" }}
        />
        <FormControl sx={{ minWidth: "200px" }}>
          <InputLabel>Select Profile</InputLabel>
          <Select
            value={selectedProfile}
            onChange={handleProfileChange}
            label="Select Profile"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {profiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.id}>
                {profile.profile}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isFiltering && (
          <Button
            variant="outlined"
            color="success"
            onClick={handleClearFilter}
          >
            Clear Filter
          </Button>
        )}
      </Box>
      <Button
        onClick={exportToCSV}
        startIcon={<FileDownloadIcon />}
        variant="contained"
        color="success"
        className="p-3"
      >
        Export to CSV
      </Button>
    </Box>
  );
};

export default HistoryFilter;
