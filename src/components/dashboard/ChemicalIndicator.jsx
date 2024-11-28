/* eslint-disable react/prop-types */
import { CardContent, Typography, Grid } from "@mui/material";
import { StyledCard } from "../../styles/styledComponents";
import { BeakerIcon, FlaskConical } from "lucide-react";
import ActuatorCard from "./ActuatorCard";

const ChemicalIndicator = ({ actuatorData }) => (
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
            icon: FlaskConical,
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

export default ChemicalIndicator;
