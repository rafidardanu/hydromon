/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Droplet, Power } from "lucide-react";
import ActuatorCard from "./ActuatorCard";

// Styled Components
const StyledCard = styled(Card)(() => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const PumpIndicator = ({ actuatorStatus }) => (
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
            icon: Droplet,
          },
          {
            key: "actuator_pompa_utama_1",
            label: "Main Pump 1",
            icon: Power,
          },
          {
            key: "actuator_pompa_utama_2",
            label: "Main Pump 2",
            icon: Power,
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
  </StyledCard>
);

export default PumpIndicator;
