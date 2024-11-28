import { THRESHOLD_OFFSETS, AIR_HUMIDITY_THRESHOLDS } from "../../../utils/constants";

export const useSetpoint = (value, metricKey, setpointData) => {
  const getThresholds = () => {
    if (!setpointData || setpointData.length === 0) return null;

    const activeSetpoint = setpointData.find((item) => item.status === 1);
    if (!activeSetpoint) return null;

    if (metricKey === "airhum") {
      return {
        ...AIR_HUMIDITY_THRESHOLDS,
        setpointValue:
          (AIR_HUMIDITY_THRESHOLDS.normal.min +
            AIR_HUMIDITY_THRESHOLDS.normal.max) /
          2,
      };
    }

    const setpointValue =
      metricKey === "airtemp"
        ? activeSetpoint["watertemp"]
        : activeSetpoint[metricKey];

    const offset = THRESHOLD_OFFSETS[metricKey];

    if (!setpointValue || !offset) return null;

    return {
      min: setpointValue - offset.max,
      normal: {
        min: setpointValue - offset.normal,
        max: setpointValue + offset.normal,
      },
      max: setpointValue + offset.max,
      setpointValue,
    };
  };

  const calculateStatus = () => {
    const thresholds = getThresholds();
    if (!thresholds) return null;

    if (value > thresholds.max) {
      return {
        status: "error",
        message: "too High!",
        color: "#d32f2f",
        icon: "high",
      };
    } else if (value < thresholds.min) {
      return {
        status: "warning",
        message: "too Low!",
        color: "#ed6c02",
        icon: "low",
      };
    } else if (
      value >= thresholds.normal.min &&
      value <= thresholds.normal.max
    ) {
      return {
        status: "success",
        message: "Normal",
        color: "#2e7d32",
        icon: "normal",
      };
    } else {
      return {
        status: "warning",
        message: "needs Attention!",
        color: "#ed6c02",
        icon: "attention",
      };
    }
  };

  return {
    thresholds: getThresholds(),
    status: calculateStatus(),
  };
};
