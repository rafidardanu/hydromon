/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import StatusCard from "./StatusCard";

// Styled Components
const StyledCard = styled(Card)(() => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const SystemStatus = ({ dbStatus, mqttStatus, deviceStatus }) => (
  <StyledCard>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        System Status
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StatusCard label="Database Connection" status={dbStatus} />
        </Grid>
        <Grid item xs={12}>
          <StatusCard label="MQTT Service" status={mqttStatus} />
        </Grid>
        <Grid item xs={12}>
          <StatusCard label="Device Status" status={deviceStatus} />
        </Grid>
      </Grid>
    </CardContent>
  </StyledCard>
);

export default SystemStatus;
