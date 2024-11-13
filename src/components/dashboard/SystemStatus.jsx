/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material";
import StatusCard from "./StatusCard";

const SystemStatus = ({ dbStatus, mqttStatus, deviceStatus }) => (
  <Card>
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
  </Card>
);

export default SystemStatus;
