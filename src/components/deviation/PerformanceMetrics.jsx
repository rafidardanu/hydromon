/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { BarChart3, CheckCircle2, XCircle, AlarmClockOff } from "lucide-react";
import { DeviationCard } from "../../styles/styledComponents";
import { DEVIATION_COLORS, ERROR_RANGES } from "../../utils/constants";

const getErrorColor = (error, paramType) => {
  const value = Math.abs(parseFloat(error));
  const ranges = ERROR_RANGES[paramType] || ERROR_RANGES.temperature;

  if (value <= ranges.high) return DEVIATION_COLORS.high;
  if (value <= ranges.medium) return DEVIATION_COLORS.medium;
  return DEVIATION_COLORS.low;
};

const getErrorIcon = (error, paramType) => {
  const value = Math.abs(parseFloat(error));
  const ranges = ERROR_RANGES[paramType] || ERROR_RANGES.temperature;

  if (value <= ranges.high)
    return <CheckCircle2 color={DEVIATION_COLORS.high} />;
  if (value <= ranges.medium)
    return <AlarmClockOff color={DEVIATION_COLORS.medium} />;
  return <XCircle color={DEVIATION_COLORS.low} />;
};

const calculateError = (measured, target) => {
  return Math.abs(measured - target).toFixed(2);
};

const calculateAverageError = (data) => {
  if (!data || data.length === 0) return 0;

  const tempErrors = data.map((row) =>
    calculateError(row.avg_watertemp, row.target_watertemp)
  );
  const ppmErrors = data.map((row) =>
    calculateError(row.avg_waterppm, row.target_waterppm)
  );
  const phErrors = data.map((row) =>
    calculateError(row.avg_waterph, row.target_waterph)
  );

  const avgTempError =
    tempErrors.reduce((sum, error) => sum + parseFloat(error), 0) /
    tempErrors.length;
  const avgPpmError =
    ppmErrors.reduce((sum, error) => sum + parseFloat(error), 0) /
    ppmErrors.length;
  const avgPhError =
    phErrors.reduce((sum, error) => sum + parseFloat(error), 0) /
    phErrors.length;

  return ((avgTempError + avgPpmError + avgPhError) / 3).toFixed(2);
};

const calculateParameterAverage = (data, parameter) => {
  if (!data || data.length === 0) return 0;

  const errorCalculations = {
    watertemp_error: () =>
      data.map((row) =>
        calculateError(row.avg_watertemp, row.target_watertemp)
      ),
    waterppm_error: () =>
      data.map((row) => calculateError(row.avg_waterppm, row.target_waterppm)),
    waterph_error: () =>
      data.map((row) => calculateError(row.avg_waterph, row.target_waterph)),
  };

  if (!errorCalculations[parameter]) return 0;

  const errors = errorCalculations[parameter]();
  const avgError =
    errors.reduce((sum, error) => sum + parseFloat(error), 0) / errors.length;

  return avgError.toFixed(2);
};

const PerformanceMetrics = ({ loading, errorData }) => {
  const metrics = [
    {
      label: "Overall Performance",
      value: calculateAverageError(errorData),
      description: "Comprehensive system measurement deviation",
      isOverall: true,
      unit: null,
    },
    {
      label: "Temperature Error",
      value: calculateParameterAverage(errorData, "watertemp_error"),
      description: "Average water temperature measurement deviation",
      paramType: "temperature",
      unit: "°C",
    },
    {
      label: "PPM Error",
      value: calculateParameterAverage(errorData, "waterppm_error"),
      description: "Average nutrient concentration measurement deviation",
      paramType: "ppm",
      unit: "ppm",
    },
    {
      label: "pH Error",
      value: calculateParameterAverage(errorData, "waterph_error"),
      description: "Average water acidity measurement deviation",
      paramType: "ph",
      unit: "pH",
    },
  ];

  return (
    <Card
      sx={{
        mb: 4,
        p: 2,
        background: "linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)",
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          textAlign: "center",
          mb: 3,
        }}
      >
        System Performance Metrics
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : errorData.length > 0 ? (
        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} key={index}>
              {metric.isOverall ? (
                // Overall Performance card
                <Card
                  sx={{
                    p: 2,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flex={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: "text.primary",
                          }}
                        >
                          {metric.label} (±)
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: "text.primary",
                            fontWeight: "bold",
                          }}
                        >
                          {metric.value} {metric.unit || ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {metric.description}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <BarChart3 size={24} color="#666666" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                // Parameter cards
                <DeviationCard deviation={metric.value}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flex={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: "text.secondary",
                          }}
                        >
                          {metric.label} (±)
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: getErrorColor(
                              metric.value,
                              metric.paramType
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {metric.value} {metric.unit || ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {metric.description}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        {getErrorIcon(metric.value, metric.paramType)}
                      </Box>
                    </Box>
                  </CardContent>
                </DeviationCard>
              )}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          Select a profile and date range to view performance metrics
        </Typography>
      )}
    </Card>
  );
};

export default PerformanceMetrics;
