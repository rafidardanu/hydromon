export const THRESHOLD_OFFSETS = {
  watertemp: { normal: 2, max: 4 },
  waterph: { normal: 0.2, max: 0.4 },
  waterppm: { normal: 50, max: 100 },
  airtemp: { normal: 3, max: 6 },
};

// Manual thresholds untuk air humidity
const AIR_HUMIDITY_THRESHOLDS = {
  min: 60,
  normal: {
    min: 65,
    max: 75,
  },
  max: 80,
};

export const useSetpoint = (value, metricKey, setpointData) => {
  const getThresholds = () => {
    if (!setpointData || setpointData.length === 0) return null;

    const activeSetpoint = setpointData.find((item) => item.status === 1);
    if (!activeSetpoint) return null;

    // Khusus untuk airhum, gunakan threshold manual
    if (metricKey === "airhum") {
      return {
        ...AIR_HUMIDITY_THRESHOLDS,
        setpointValue:
          (AIR_HUMIDITY_THRESHOLDS.normal.min +
            AIR_HUMIDITY_THRESHOLDS.normal.max) /
          2,
      };
    }

    // Untuk airtemp, gunakan watertemp sebagai referensi
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
