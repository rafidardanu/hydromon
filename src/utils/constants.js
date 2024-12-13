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

export const DEVIATION_COLORS = {
  high: "#4CAF50",
  medium: "#FF9800",
  low: "#F44336",
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
  DATA_MONITORING: "data_monitoring",
  DATA_ACTUATOR: "data_actuator",
  LAST_MONITORING_UPDATE: "last_monitoring_update",
  LAST_ACTUATOR_UPDATE: "last_actuator_update",
};

export const REFRESH_INTERVALS = {
  PROFILE_DATA: 1000,
  DAILY_DATA: 60000,
  WEEKLY_DATA: 300000,
  DB_STATUS: 2000,
  DEVICE_STATUS: 10000,
};

export const THRESHOLD_OFFSETS = {
  watertemp: { normal: 8, max: 15 },
  waterph: { normal: 0.5, max: 1.0 },
  waterppm: { normal: 50, max: 100 },
  airtemp: { normal: 8, max: 15 },
};

export const AIR_HUMIDITY_THRESHOLDS = {
  min: 60,
  normal: {
    min: 65,
    max: 75,
  },
  max: 80,
};

export const ERROR_RANGES = {
  temperature: {
    high: 5,
    medium: 10,
  },
  ppm: {
    high: 50,
    medium: 100,
  },
  ph: {
    high: 0.5,
    medium: 1.0,
  },
};