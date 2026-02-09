import React from "react";
import { motion } from "framer-motion";
import { COLORS, getAQIColor, getAQIStatus } from "../styles/colors";

const PollutionCard = ({ data, location, showDetails = false, selectedUnit = "aqi" }) => {
  if (!data || !data.list || data.list.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
        <p style={styles.noData}>Data tidak tersedia</p>
      </motion.div>
    );
  }

  const airData = data.list[0];
  const aqi = airData.main.aqi;
  const components = airData.components;

  // Konversi European AQI (1-5) ke estimasi US AQI
  const usAQI = aqi * 50;
  const aqiColor = getAQIColor(usAQI);
  const aqiStatus = getAQIStatus(usAQI);

  const pollutants = [
    { name: "PM2.5", value: components.pm2_5?.toFixed(2) || "N/A", unit: "μg/m³", icon: "🌫️" },
    { name: "PM10", value: components.pm10?.toFixed(2) || "N/A", unit: "μg/m³", icon: "💨" },
    { name: "CO", value: components.co?.toFixed(2) || "N/A", unit: "μg/m³", icon: "⚠️" },
    { name: "NO₂", value: components.no2?.toFixed(2) || "N/A", unit: "μg/m³", icon: "🏭" },
    { name: "SO₂", value: components.so2?.toFixed(2) || "N/A", unit: "μg/m³", icon: "🌋" },
    { name: "O₃", value: components.o3?.toFixed(2) || "N/A", unit: "μg/m³", icon: "☀️" },
  ];

  // Jika user memilih satuan tertentu (selain AQI), filter grid agar hanya menampilkan polutan tersebut
  const mapUnitToPollutantName = {
    pm25: "PM2.5",
    pm10: "PM10",
    co: "CO",
    no2: "NO₂",
    so2: "SO₂",
    o3: "O₃",
  };
  const filteredPollutants = selectedUnit && selectedUnit !== "aqi" ? pollutants.filter((p) => p.name === mapUnitToPollutantName[selectedUnit]) : pollutants;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        {location && (
          <div style={styles.locationInfo}>
            <span style={styles.locationIcon}>📍</span>
            <h3 style={styles.locationName}>
              {location.name}, {location.country}
            </h3>
          </div>
        )}
        <div style={styles.timestamp}>{new Date(airData.dt * 1000).toLocaleString("id-ID")}</div>
      </div>

      {/* AQI Score */}
      <div style={styles.aqiContainer}>
        <div style={styles.aqiScoreWrapper}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              ...styles.aqiScore,
              background: `linear-gradient(135deg, ${aqiColor}, ${aqiColor}dd)`,
            }}
          >
            <span style={styles.aqiValue}>{Math.round(usAQI)}</span>
            <span style={styles.aqiLabel}>AQI</span>
          </motion.div>
          <div style={styles.aqiInfo}>
            <h4 style={{ ...styles.aqiStatus, color: aqiColor }}>{aqiStatus}</h4>
            <p style={styles.aqiDescription}>{getAQIDescription(usAQI)}</p>
          </div>
        </div>
      </div>

      {/* Pollutants Grid */}
      {showDetails && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={styles.pollutantsGrid}>
          {filteredPollutants.map((pollutant, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} style={styles.pollutantItem}>
              <span style={styles.pollutantIcon}>{pollutant.icon}</span>
              <div style={styles.pollutantInfo}>
                <span style={styles.pollutantName}>{pollutant.name}</span>
                <span style={styles.pollutantValue}>
                  {pollutant.value} <span style={styles.pollutantUnit}>{pollutant.unit}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper function untuk deskripsi AQI
const getAQIDescription = (aqi) => {
  if (aqi <= 50) return "Kualitas udara baik. Udara bersih dan sehat untuk aktivitas outdoor.";
  if (aqi <= 100) return "Kualitas udara sedang. Dapat diterima untuk sebagian besar orang.";
  if (aqi <= 150) return "Tidak sehat untuk kelompok sensitif. Batasi aktivitas outdoor yang berat.";
  if (aqi <= 200) return "Tidak sehat. Semua orang mungkin mengalami efek kesehatan.";
  if (aqi <= 300) return "Sangat tidak sehat. Peringatan kesehatan: semua orang dapat terkena dampak.";
  return "Berbahaya. Peringatan darurat kesehatan: hindari aktivitas outdoor.";
};

const styles = {
  card: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  header: {
    marginBottom: "1.5rem",
  },
  locationInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  locationIcon: {
    fontSize: "1.5rem",
  },
  locationName: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: COLORS.textLight,
    margin: 0,
  },
  timestamp: {
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.7)",
    fontWeight: "400",
  },
  aqiContainer: {
    marginBottom: "2rem",
  },
  aqiScoreWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  aqiScore: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
  },
  aqiValue: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: COLORS.textLight,
    lineHeight: 1,
  },
  aqiLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: COLORS.textLight,
    marginTop: "0.25rem",
  },
  aqiInfo: {
    flex: 1,
  },
  aqiStatus: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  aqiDescription: {
    fontSize: "1rem",
    color: "rgba(249, 249, 244, 0.85)",
    lineHeight: 1.6,
  },
  pollutantsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  pollutantItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: "rgba(249, 249, 244, 0.05)",
    borderRadius: "12px",
    border: `1px solid rgba(249, 249, 244, 0.1)`,
  },
  pollutantIcon: {
    fontSize: "1.5rem",
  },
  pollutantInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  pollutantName: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "rgba(249, 249, 244, 0.7)",
  },
  pollutantValue: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: COLORS.textLight,
  },
  pollutantUnit: {
    fontSize: "0.8rem",
    fontWeight: "400",
    color: "rgba(249, 249, 244, 0.6)",
  },
  noData: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "rgba(249, 249, 244, 0.7)",
    padding: "2rem",
  },
};

export default PollutionCard;
