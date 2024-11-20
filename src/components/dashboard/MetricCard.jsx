/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box, Card, CardContent, Alert } from "@mui/material";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  AlertOctagon,
} from "lucide-react";
import { useSetpoint } from "./hooks/useSetpoint";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.04)",
    boxShadow: theme.shadows[8],
  },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto Mono', monospace",
  fontSize: "3.3rem",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

const CenteredAlert = styled(Alert)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  "& .MuiAlert-message": {
    flex: "none",
    width: "100%",
  },
}));

const getStatusIcon = (iconType, color) => {
  switch (iconType) {
    case "high":
      return <AlertOctagon size={24} color={color} />;
    case "low":
      return <AlertTriangle size={24} color={color} />;
    case "normal":
      return <CheckCircle size={24} color={color} />;
    case "attention":
      return <AlertCircle size={24} color={color} />;
    default:
      return null;
  }
};

const formatValue = (value) => {
  const numValue = Number(value);
  return numValue % 1 === 0 ? numValue.toString() : numValue.toFixed(1);
};

const MetricCard = ({ value, unit, label, color, metricKey, setpointData }) => {
  const [showAlert, setShowAlert] = useState(false);
  const { status, thresholds } = useSetpoint(value, metricKey, setpointData);

  // Format value conditionally
  const formattedValue = formatValue(value);
  const formattedSetpoint = thresholds
    ? formatValue(thresholds.setpointValue)
    : null;

  useEffect(() => {
    setShowAlert(!!status);
  }, [status]);

  return (
    <StyledCard>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {status && getStatusIcon(status.icon, status.color)}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {label}
          </Typography>
        </Box>
        <MetricValue style={{ color }}>
          {formattedValue}{unit}
        </MetricValue>
        <Box in={showAlert}>
          <CenteredAlert
            severity={status?.status || "info"}
            sx={{ mt: 2 }}
            icon={false}
          >
            {`${label} ${status?.message || ""}`}
            {thresholds && (
              <Typography variant="caption" display="block">
                Setpoint: {formattedSetpoint} {unit}
              </Typography>
            )}
          </CenteredAlert>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default MetricCard;
