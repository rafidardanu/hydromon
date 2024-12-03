/* eslint-disable react/prop-types */
import { CardContent, Typography, Grid } from "@mui/material";
import { StyledCard } from "../../styles/styledComponents";
import StatusCard from "./StatusCard";

const SystemStatus = ({ dbStatus, mqttStatus, deviceStatus }) => (
  <StyledCard>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        System Status
      </Typography>
      <Grid container spacing={1.4}>
        <Grid item xs={12}>
          <StatusCard label="Database Connection" status={dbStatus} />
        </Grid>
        <Grid item xs={12}>
          <StatusCard label="MQTT Connection" status={mqttStatus} />
        </Grid>
        <Grid item xs={12}>
          <StatusCard label="Device Status" status={deviceStatus} />
        </Grid>
      </Grid>
    </CardContent>
  </StyledCard>
);

export default SystemStatus;
