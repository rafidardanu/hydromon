import {
  Power,
  Droplet,
  Thermometer,
  Activity,
  Wind,
  BeakerIcon,
} from "lucide-react";

export const CHART_COLORS = {
  watertemp: "#8884d8",
  waterph: "#ffc658",
  waterppm: "#11a63b",
  airtemp: "#ff7300",
  airhum: "#413ea0",
};

export const METRIC_CONFIGS = {
  watertemp: {
    unit: "°C",
    label: "Water Temperature",
    icon: Thermometer,
    color: CHART_COLORS.watertemp,
    chartType: "temperature",
  },
  waterph: {
    unit: "pH",
    label: "Water pH",
    icon: BeakerIcon,
    color: CHART_COLORS.waterph,
    chartType: "ph",
  },
  waterppm: {
    unit: "ppm",
    label: "Water PPM",
    icon: Droplet,
    color: CHART_COLORS.waterppm,
    chartType: "ppm",
  },
  airtemp: {
    unit: "°C",
    label: "Air Temperature",
    icon: Wind,
    color: CHART_COLORS.airtemp,
    chartType: "temperature",
  },
  airhum: {
    unit: "%",
    label: "Air Humidity",
    icon: Activity,
    color: CHART_COLORS.airhum,
    chartType: "temperature",
  },
};

export const ALERT_THRESHOLDS = {
  watertemp: {
    min: 20,
    max: 30,
    messages: {
      high: "Water temp is too high!",
      low: "Water temp is too low!",
    },
  },
  waterph: {
    min: 5.5,
    max: 7.0,
    messages: {
      high: "Water pH is too high!",
      low: "Water pH is too low!",
    },
  },
  waterppm: {
    min: 560,
    max: 840,
    messages: {
      high: "PPM level is too high!",
      low: "PPM level is too low!",
    },
  },
  airtemp: {
    min: 20,
    max: 32,
    messages: {
      high: "Air temp is too high!",
      low: "Air tempy is too low!",
    },
  },
  airhum: {
    min: 60,
    max: 80,
    messages: {
      high: "Air humidity is too high!",
      low: "Air humidity is too low!",
    },
  },
};

export const CHART_TYPES = {
  TEMPERATURE: "temperature",
  PH: "ph",
  PPM: "ppm",
};

export const ACTUATOR_CONFIGS = {
  actuator_nutrisi: { label: "Nutrient Pump", icon: Droplet },
  actuator_ph_up: { label: "pH Up Pump", icon: BeakerIcon },
  actuator_ph_down: { label: "pH Down Pump", icon: BeakerIcon },
  actuator_air_baku: { label: "Raw Water Pump", icon: Droplet },
  actuator_pompa_utama_1: { label: "Main Pump 1", icon: Power },
  actuator_pompa_utama_2: { label: "Main Pump 2", icon: Power },
};

export const STORAGE_KEYS = {
  CARD_DATA: "mqtt_card_data",
  ACTUATOR_STATUS: "mqtt_actuator_status",
  LAST_UPDATE: "mqtt_last_update",
};

export const REFRESH_INTERVALS = {
  DAILY_DATA: 60000,
  WEEKLY_DATA: 300000,
  DB_STATUS: 5000,
  DEVICE_STATUS: 1000,
};
