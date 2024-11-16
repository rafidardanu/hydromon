/* eslint-disable react/prop-types */
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Components
  const StyledCard = styled(Card)(({ theme }) => ({
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.04)",
      boxShadow: theme.shadows[8],
    },
  }));

const LastUpdate = ({ lastUpdate }) => {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
          Last Update MQTT
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {lastUpdate
            ? new Date(lastUpdate).toLocaleString()
            : "No updates yet"}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "text.primary", mt: 2 }}
        >
          Current Time
        </Typography>
        <Typography variant="body1">{currentTime}</Typography>
      </CardContent>
    </StyledCard>
  );
};

export default LastUpdate;
