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

export const ACCURACY_COLORS = {
  high: "#4CAF50", // green for >= 90%
  medium: "#FF9800", // orange for >= 80%
  low: "#F44336", // red for < 80%
};

export const METRIC_CONFIGS = {
  watertemp: {
    unit: "°C",
    label: "Water Temp",
    icon: Thermometer,
    color: CHART_COLORS.watertemp,
    chartType: "temperature",
  },
  waterph: {
    unit: "pH",
    label: "pH",
    icon: BeakerIcon,
    color: CHART_COLORS.waterph,
    chartType: "ph",
  },
  waterppm: {
    unit: "ppm",
    label: "PPM",
    icon: Droplet,
    color: CHART_COLORS.waterppm,
    chartType: "ppm",
  },
  airtemp: {
    unit: "°C",
    label: "Air Temp",
    icon: Wind,
    color: CHART_COLORS.airtemp,
    chartType: "temperature",
  },
  airhum: {
    unit: "%",
    label: "Humidity",
    icon: Activity,
    color: CHART_COLORS.airhum,
    chartType: "temperature",
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
  DB_STATUS: 2000,
  DEVICE_STATUS: 1000,
};
