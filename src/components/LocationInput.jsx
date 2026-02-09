import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import { COLORS } from "../styles/colors";

const LocationInput = ({ onSearch, onUseCurrentLocation, loading = false, defaultCity = "" }) => {
  const [city, setCity] = useState(defaultCity || "");

  // Sinkronkan nilai saat defaultCity berubah (misal saat kembali dari halaman lain)
  React.useEffect(() => {
    setCity(defaultCity || "");
  }, [defaultCity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>🔍 Cari Kualitas Udara</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <input type="text" placeholder="Masukkan nama kota (contoh: Jakarta, Surabaya, Bandung)" value={city} onChange={(e) => setCity(e.target.value)} disabled={loading} style={styles.input} />
            <Button type="submit" disabled={!city.trim() || loading} variant="primary">
              {loading ? "🔄 Mencari..." : "🔍 Cari"}
            </Button>
          </div>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>atau</span>
        </div>

        <Button onClick={onUseCurrentLocation} disabled={loading} variant="secondary" fullWidth>
          <span style={styles.locationIcon}>📍</span>
          {loading ? "Mengambil lokasi..." : "Gunakan Lokasi Saat Ini"}
        </Button>

        <p style={styles.hint}>
          💡 <strong>Tips:</strong> Ketik nama kota untuk melihat kualitas udara di area tersebut, atau gunakan lokasi Anda saat ini untuk hasil yang lebih akurat.
          <br />
          <span style={{ fontSize: "0.85em", opacity: 0.8 }}>Fitur lokasi otomatis memerlukan GPS/WiFi aktif dan izin akses lokasi browser.</span>
        </p>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "0 1rem",
  },
  card: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  form: {
    marginBottom: "1.5rem",
  },
  inputWrapper: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  input: {
    flex: "1",
    minWidth: "250px",
    padding: "0.875rem 1.25rem",
    fontSize: "1rem",
    color: COLORS.textLight,
    background: "rgba(249, 249, 244, 0.1)",
    border: `2px solid rgba(249, 249, 244, 0.2)`,
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  divider: {
    position: "relative",
    textAlign: "center",
    margin: "1.5rem 0",
  },
  dividerText: {
    position: "relative",
    display: "inline-block",
    padding: "0 1rem",
    color: "rgba(249, 249, 244, 0.6)",
    fontSize: "0.9rem",
    fontWeight: "500",
    background: "rgba(76, 140, 158, 0.15)",
    zIndex: 1,
  },
  locationIcon: {
    fontSize: "1.2rem",
  },
  hint: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "rgba(58, 125, 68, 0.1)",
    border: `1px solid rgba(58, 125, 68, 0.3)`,
    borderRadius: "12px",
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.85)",
    lineHeight: 1.6,
    textAlign: "center",
  },
};

export default LocationInput;
