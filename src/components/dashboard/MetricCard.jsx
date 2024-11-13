/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Collapse,
  Alert,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { ALERT_THRESHOLDS } from "../../utils/constants";

// Styled Components
const StyledCard = styled(Card)(() => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto Mono', monospace",
  fontSize: "3rem",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

const MetricCard = ({
  value,
  unit,
  label,
  icon: Icon,
  color,
  metricKey,
//   setpointData,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("warning");

  useEffect(() => {
    const thresholds = ALERT_THRESHOLDS[metricKey];
    if (thresholds) {
      if (value > thresholds.max) {
        setShowAlert(true);
        setAlertMessage(thresholds.messages.high);
        setAlertSeverity("error");
      } else if (value < thresholds.min) {
        setShowAlert(true);
        setAlertMessage(thresholds.messages.low);
        setAlertSeverity("warning");
      } else {
        setShowAlert(false);
      }
    }
  }, [value, metricKey]);

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
          <Icon size={24} color={color} />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {label}
          </Typography>
        </Box>
        <MetricValue style={{ color }}>
          {value} {unit}
        </MetricValue>
        <Collapse in={showAlert}>
          <Alert
            severity={alertSeverity}
            icon={<AlertTriangle size={24} />}
            sx={{ mt: 2 }}
          >
            {alertMessage}
            <Typography variant="caption" display="block">
              Range: {ALERT_THRESHOLDS[metricKey].min} -{" "}
              {ALERT_THRESHOLDS[metricKey].max} {unit}
            </Typography>
          </Alert>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default MetricCard;
