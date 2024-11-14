/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BeakerIcon } from "lucide-react";
import ActuatorCard from "./ActuatorCard";

// Styled Components
const StyledCard = styled(Card)(() => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const ChemicalIndicator = ({ actuatorStatus }) => (
  <StyledCard>
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
  </StyledCard>
);

export default ChemicalIndicator;
