/* eslint-disable react/prop-types */
import { CardContent, Typography } from "@mui/material";
import { StyledCard } from "../../styles/styledComponents";

const LastUpdate = ({ lastMonitoringUpdate, lastActuatorUpdate }) => {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
          Last Update Monitoring
        </Typography>
        <Typography variant="body1">
          {lastMonitoringUpdate
            ? new Date(lastMonitoringUpdate).toLocaleString()
            : "No monitoring updates yet"}
        </Typography>
        
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "text.primary", mt: 3 }}
        >
          Last Update Actuator
        </Typography>
        <Typography variant="body1">
          {lastActuatorUpdate
            ? new Date(lastActuatorUpdate).toLocaleString()
            : "No actuator updates yet"}
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "text.primary", mt: 3 }}
        >
          Current Time
        </Typography>
        <Typography variant="body1">{currentTime}</Typography>
      </CardContent>
    </StyledCard>
  );
};

export default LastUpdate;