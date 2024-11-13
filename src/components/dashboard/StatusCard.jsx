/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

const StatusCard = ({ label, status }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: status === "connected" ? "success.light" : "error.light",
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 1,
      },
    }}
  >
    <Typography variant="subtitle1">{label}</Typography>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
      {status === "connected" ? "Connected" : "Disconnected"}
    </Typography>
  </Box>
);

export default StatusCard;
