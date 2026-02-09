import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PollutionCard from "../components/PollutionCard";
import PollutantChart from "../components/PollutantChart";
import RadioGroup from "../components/RadioGroup";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { fetchAirQualityHistory } from "../services/airApi";
import { COLORS } from "../styles/colors";

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coordinates, location: locationInfo, airQualityData } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchHistoricalData = useCallback(async () => {
    if (!coordinates) return;
    setLoading(true);
    setError(null);

    try {
      // create per-request AbortController and store reference for cleanup
      const controller = new AbortController();
      fetchHistoricalData._lastController = controller;

      const history = await fetchAirQualityHistory(coordinates.lat, coordinates.lon, undefined, undefined, { signal: controller.signal });
      setHistoricalData(history);
    } catch (err) {
      if (err.name === "AbortError") {
        // fetch was aborted — do not set error state
        // eslint-disable-next-line no-console
        console.log("Historical fetch aborted");
      } else {
        setError(err.message || "Gagal mengambil data historis");
        // eslint-disable-next-line no-console
        console.error("Error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [coordinates]);

  useEffect(() => {
    // Scroll ke atas saat halaman dibuka
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    // If no location data, redirect to home
    if (!coordinates) {
      navigate("/");
      return;
    }

    // Fetch historical data
    fetchHistoricalData();

    // cleanup on unmount: abort any ongoing historical fetch
    return () => {
      try {
        const controller = fetchHistoricalData._lastController;
        if (controller) controller.abort();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Error aborting historical fetch on unmount:", e);
      }
    };
  }, [coordinates, navigate, fetchHistoricalData]);

  // componentDidUpdate equivalent: run when historicalData changes
  useEffect(() => {
    if (!historicalData) return;

    // eslint-disable-next-line no-console
    console.log("historicalData updated:", historicalData);

    // Optional: persist or perform any derived computations here
  }, [historicalData]);

  const categoryOptions = [
    {
      value: "all",
      label: "Semua Data",
      icon: "🌍",
      description: "Menampilkan semua polutan",
    },
    {
      value: "air",
      label: "Kualitas Udara",
      icon: "💨",
      description: "PM2.5, PM10, O₃",
    },
    {
      value: "emission",
      label: "Emisi Kendaraan",
      icon: "🚗",
      description: "CO, NO₂",
    },
    {
      value: "industrial",
      label: "Industri",
      icon: "🏭",
      description: "SO₂, NO₂",
    },
  ];

  const getFilteredData = () => {
    if (!airQualityData || selectedCategory === "all") {
      return airQualityData;
    }

    // Filter logic based on category
    const filteredList = airQualityData.list.map((item) => {
      const components = { ...item.components };

      if (selectedCategory === "air") {
        // Keep only air quality related pollutants
        return {
          ...item,
          components: {
            pm2_5: components.pm2_5,
            pm10: components.pm10,
            o3: components.o3,
          },
        };
      } else if (selectedCategory === "emission") {
        // Keep only vehicle emission related
        return {
          ...item,
          components: {
            co: components.co,
            no2: components.no2,
          },
        };
      } else if (selectedCategory === "industrial") {
        // Keep only industrial emission related
        return {
          ...item,
          components: {
            so2: components.so2,
            no2: components.no2,
          },
        };
      }

      return item;
    });

    return { ...airQualityData, list: filteredList };
  };

  const getCategoryInsight = () => {
    const insights = {
      all: {
        title: "🌍 Overview Lengkap",
        description: "Anda melihat semua data polutan udara yang tersedia. Data ini mencakup partikel halus (PM2.5, PM10), gas berbahaya (CO, NO₂, SO₂), dan ozon (O₃).",
      },
      air: {
        title: "💨 Kualitas Udara",
        description: "PM2.5 dan PM10 adalah partikel halus yang dapat menembus paru-paru. Ozon (O₃) di permukaan dapat menyebabkan iritasi pernapasan. Hindari aktivitas outdoor saat levelnya tinggi.",
      },
      emission: {
        title: "🚗 Emisi Kendaraan",
        description: "CO (Carbon Monoxide) dan NO₂ (Nitrogen Dioxide) terutama berasal dari kendaraan bermotor. Tingkat tinggi dapat menyebabkan masalah pernapasan dan mengurangi kapasitas oksigen darah.",
      },
      industrial: {
        title: "🏭 Industri",
        description: "SO₂ (Sulfur Dioxide) terutama dari pembakaran batu bara dan minyak. NO₂ juga diproduksi oleh industri. Keduanya dapat menyebabkan hujan asam dan masalah pernapasan.",
      },
    };

    return insights[selectedCategory];
  };

  const filteredData = getFilteredData();
  const insight = getCategoryInsight();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={styles.header}>
          <Button onClick={() => navigate("/")} variant="outline">
            ← Kembali ke Home
          </Button>
          <h1 style={styles.pageTitle}>📊 Detail & Analisis Historis</h1>
          {locationInfo && (
            <p style={styles.locationText}>
              📍 {locationInfo.name}
              {locationInfo.country && `, ${locationInfo.country}`}
            </p>
          )}
        </motion.div>

        {/* Filter Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={styles.filterSection}>
          <div style={styles.filterCard}>
            <h3 style={styles.filterTitle}>🔍 Filter Kategori Polusi</h3>
            <RadioGroup options={categoryOptions} selectedValue={selectedCategory} onChange={setSelectedCategory} name="pollution-category" />
          </div>
        </motion.div>

        {/* Insight Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={styles.insightCard}>
          <h3 style={styles.insightTitle}>{insight.title}</h3>
          <p style={styles.insightDescription}>{insight.description}</p>
        </motion.div>

        {/* Current Data */}
        {filteredData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={styles.section}>
            <PollutionCard data={filteredData} location={locationInfo} showDetails={true} />
          </motion.div>
        )}

        {/* Historical Chart */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.loadingCard}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Memuat data historis...</p>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.errorCard}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorText}>{error}</p>
          </motion.div>
        )}

        {historicalData && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={styles.section}>
            <PollutantChart data={historicalData} type="historical" />
          </motion.div>
        )}

        {/* Educational Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={styles.educationSection}>
          <h2 style={styles.educationTitle}>📚 Informasi Edukatif</h2>
          <div style={styles.educationGrid}>
            <div style={styles.educationCard}>
              <h4 style={styles.educationCardTitle}>🌫️ PM2.5 & PM10</h4>
              <p style={styles.educationCardText}>Partikel halus berdiameter 2.5 dan 10 mikrometer. Dapat menembus paru-paru dan menyebabkan masalah pernapasan serta kardiovaskular.</p>
            </div>
            <div style={styles.educationCard}>
              <h4 style={styles.educationCardTitle}>⚠️ CO (Carbon Monoxide)</h4>
              <p style={styles.educationCardText}>Gas tak berwarna dan tak berbau dari pembakaran tidak sempurna. Mengurangi kemampuan darah membawa oksigen ke organ vital.</p>
            </div>
            <div style={styles.educationCard}>
              <h4 style={styles.educationCardTitle}>🏭 NO₂ (Nitrogen Dioxide)</h4>
              <p style={styles.educationCardText}>Gas cokelat kemerahan dari kendaraan dan industri. Dapat memperburuk asma dan meningkatkan kerentanan infeksi pernapasan.</p>
            </div>
            <div style={styles.educationCard}>
              <h4 style={styles.educationCardTitle}>☀️ O₃ (Ozone)</h4>
              <p style={styles.educationCardText}>Ozon di permukaan (bukan lapisan ozon stratosfer) dapat menyebabkan iritasi mata, hidung, dan tenggorokan.</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={styles.actionSection}>
          <Button onClick={() => navigate("/")} variant="primary" size="large">
            🏠 Kembali ke Halaman Utama
          </Button>
          <Button onClick={fetchHistoricalData} variant="secondary" size="large">
            🔄 Refresh Data
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "2rem",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  },
  header: {
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "700",
    color: COLORS.textLight,
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
  locationText: {
    fontSize: "1.2rem",
    color: "rgba(249, 249, 244, 0.8)",
    fontWeight: "500",
  },
  filterSection: {
    marginBottom: "2rem",
  },
  filterCard: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    padding: "2rem",
  },
  filterTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "1.5rem",
  },
  insightCard: {
    background: `linear-gradient(135deg, rgba(58, 125, 68, 0.2), rgba(76, 140, 158, 0.2))`,
    backdropFilter: "blur(20px)",
    border: `1px solid ${COLORS.buttonPrimary}`,
    borderRadius: "24px",
    padding: "2rem",
    marginBottom: "2rem",
  },
  insightTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "1rem",
  },
  insightDescription: {
    fontSize: "1rem",
    color: "rgba(249, 249, 244, 0.9)",
    lineHeight: 1.7,
  },
  section: {
    marginBottom: "2rem",
  },
  loadingCard: {
    padding: "3rem",
    textAlign: "center",
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    marginBottom: "2rem",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: `4px solid rgba(249, 249, 244, 0.2)`,
    borderTop: `4px solid ${COLORS.navbar}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 1rem",
  },
  loadingText: {
    color: COLORS.textLight,
    fontSize: "1.1rem",
  },
  errorCard: {
    padding: "1.5rem",
    background: "rgba(181, 82, 57, 0.2)",
    border: `2px solid ${COLORS.danger}`,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  errorIcon: {
    fontSize: "2rem",
  },
  errorText: {
    color: COLORS.textLight,
    fontSize: "1rem",
    margin: 0,
  },
  educationSection: {
    marginTop: "3rem",
    marginBottom: "2rem",
  },
  educationTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: COLORS.textLight,
    marginBottom: "2rem",
    textAlign: "center",
  },
  educationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  educationCard: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "16px",
    padding: "1.5rem",
    transition: "transform 0.3s ease",
  },
  educationCardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "0.75rem",
  },
  educationCardText: {
    fontSize: "0.95rem",
    color: "rgba(249, 249, 244, 0.8)",
    lineHeight: 1.6,
  },
  actionSection: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginTop: "3rem",
  },
};

export default DetailPage;
