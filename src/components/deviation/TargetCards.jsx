/* eslint-disable react/prop-types */
import {
  Grid,
  Box,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataSetpoint } from "../../styles/styledComponents";
import { CHART_COLORS } from "../../utils/constants";

const TargetCards = ({ loading, targetValues }) => {
  if (loading) {
    return (
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Grid>
    );
  }

  if (!targetValues) {
    return null;
  }

  const targetData = [
    {
      title: "Target Water Temp",
      value: targetValues.watertemp.toFixed(1),
      unit: "°C",
      color: CHART_COLORS.watertemp,
    },
    {
      title: "Target Water PPM",
      value: targetValues.waterppm.toFixed(1),
      unit: "",
      color: CHART_COLORS.waterppm,
    },
    {
      title: "Target Water pH",
      value: targetValues.waterph.toFixed(1),
      unit: "",
      color: CHART_COLORS.waterph,
    },
  ];

  return (
    <Grid item container spacing={1} mb={3}>
      {targetData.map((data, index) => (
        <Grid item xs={12} md={4} key={index}>
          <DataSetpoint bgcolor={data.color}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {data.title}
              </Typography>
              <Typography variant="h4">
                {data.value}
                {data.unit}
              </Typography>
            </CardContent>
          </DataSetpoint>
        </Grid>
      ))}
    </Grid>
  );
};

export default TargetCards;
