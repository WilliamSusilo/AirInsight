// Environmental Theme Color Palette
export const COLORS = {
  // Primary Colors
  primaryBg: "#2E3A3F", // Charcoal Gray - Background utama
  secondaryBg: "#9FBF9E", // Soft Sage Green - Background sekunder
  textLight: "#F9F9F4", // Ivory White - Text terang

  // Action Colors
  buttonPrimary: "#3A7D44", // Emerald Green - Tombol utama
  navbar: "#4C8C9E", // Muted Teal Blue - Navbar

  // Status Colors
  warning: "#D5A021", // Amber Dust - Warning
  danger: "#B55239", // Rusty Red - Danger/High pollution
  accent: "#6B5B95", // Slate Purple - Accent
  hover: "#E8DCA2", // Pale Yellow Smoke - Hover states

  // Additional Utility Colors
  cardBg: "rgba(79, 140, 158, 0.1)", // Semi-transparent teal
  glassBg: "rgba(249, 249, 244, 0.05)", // Glassmorphism background
  borderGlass: "rgba(249, 249, 244, 0.18)", // Glassmorphism border

  // AQI Level Colors
  aqi: {
    good: "#3A7D44", // Green
    moderate: "#D5A021", // Amber
    unhealthySensitive: "#FF9800", // Orange
    unhealthy: "#B55239", // Rusty Red
    veryUnhealthy: "#9C27B0", // Purple
    hazardous: "#7B1FA2", // Dark Purple
  },
};

// Helper function untuk mendapatkan warna berdasarkan AQI level
export const getAQIColor = (aqi) => {
  if (aqi <= 50) return COLORS.aqi.good;
  if (aqi <= 100) return COLORS.aqi.moderate;
  if (aqi <= 150) return COLORS.aqi.unhealthySensitive;
  if (aqi <= 200) return COLORS.aqi.unhealthy;
  if (aqi <= 300) return COLORS.aqi.veryUnhealthy;
  return COLORS.aqi.hazardous;
};

// Helper function untuk mendapatkan status text berdasarkan AQI
export const getAQIStatus = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};
