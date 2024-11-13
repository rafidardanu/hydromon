/* eslint-disable react/prop-types */
import { Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, METRIC_CONFIGS } from "../../utils/constants";

const ChartComponent = ({ data, title, selectedChart }) => {
  const getChartLines = () => {
    switch (selectedChart) {
      case "temperature":
        return ["watertemp", "airtemp", "airhum"];
      case "ph":
        return ["waterph"];
      case "ppm":
        return ["waterppm"];
      default:
        return [];
    }
  };

  const chartLines = getChartLines();

  return (
    <Paper elevation={6} sx={{ borderRadius: 2, p: 3, position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis
            dataKey={title === "Daily Chart" ? "hour" : "date"}
            tickFormatter={(value) =>
              title === "Daily Chart"
                ? `${value}:00`
                : new Date(value).toLocaleDateString()
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) =>
              title === "Daily Chart"
                ? `${label}:00`
                : new Date(label).toLocaleString()
            }
            formatter={(value, name) => {
              const metricKey = name.split("_")[1];
              const config = METRIC_CONFIGS[metricKey] || {};
              return [
                `${Number(value).toFixed(1)}${config.unit || ""}`,
                config.label || name,
              ];
            }}
          />
          <Legend
            formatter={(value) => METRIC_CONFIGS[value]?.label || value}
          />
          <CartesianGrid strokeDasharray="3 3" />
          {chartLines.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={`avg_${key}`}
              name={key}
              stroke={CHART_COLORS[key]}
              strokeWidth={2}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ChartComponent;
