/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

const ActuatorCard = ({ label, status, icon: Icon }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: status === 1 ? "success.light" : "grey.100",
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Icon size={20} />
      <Typography>{label}</Typography>
    </Box>
    <Typography sx={{ fontWeight: "bold" }}>
      {status === 1 ? "ON" : "OFF"}
    </Typography>
  </Box>
);

export default ActuatorCard;
