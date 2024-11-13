/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { BeakerIcon } from "lucide-react";
import ActuatorCard from "./ActuatorCard";

const ChemicalIndicator = ({ actuatorStatus }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        Chemical Indicator
      </Typography>
      <Grid container spacing={2}>
        {[
          {
            key: "actuator_ph_up",
            label: "pH Up Pump",
            icon: BeakerIcon,
          },
          {
            key: "actuator_ph_down",
            label: "pH Down Pump",
            icon: BeakerIcon,
          },
          {
            key: "actuator_nutrisi",
            label: "Nutrient Pump",
            icon: BeakerIcon,
          },
        ].map(({ key, label, icon }) => (
          <Grid item xs={12} key={key}>
            <ActuatorCard
              label={label}
              status={actuatorStatus[key]}
              icon={icon}
            />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default ChemicalIndicator;
