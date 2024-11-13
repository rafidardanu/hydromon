/* eslint-disable react/prop-types */
import { Card, CardContent, Typography } from "@mui/material";

const LastUpdate = ({ lastUpdate }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        Last Update MQTT
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {lastUpdate ? new Date(lastUpdate).toLocaleString() : "No updates yet"}
      </Typography>
    </CardContent>
  </Card>
);

export default LastUpdate;
