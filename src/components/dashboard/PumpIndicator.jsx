/* eslint-disable react/prop-types */
import { CardContent, Typography, Grid } from "@mui/material";
import { StyledCard } from "../../styles/styledComponents";
import { Waves, Droplets } from "lucide-react";
import ActuatorCard from "./ActuatorCard";

const PumpIndicator = ({ actuatorData }) => (
  <StyledCard>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
        Pumps Indicator
      </Typography>
      <Grid container spacing={2}>
        {[
          {
            key: "actuator_air_baku",
            label: "Raw Water Pump",
            icon: Droplets,
          },
          {
            key: "actuator_pompa_utama_1",
            label: "Main Pump 1",
            icon: Waves,
          },
          {
            key: "actuator_pompa_utama_2",
            label: "Main Pump 2",
            icon: Waves,
          },
        ].map(({ key, label, icon }) => (
          <Grid item xs={12} key={key}>
            <ActuatorCard
              label={label}
              status={actuatorData[key]}
              icon={icon}
            />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </StyledCard>
);

export default PumpIndicator;
