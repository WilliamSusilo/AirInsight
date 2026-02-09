import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import LocationInput from "../components/LocationInput";
import PollutionCard from "../components/PollutionCard";
import PollutantChart from "../components/PollutantChart";
import Dropdown from "../components/Dropdown";
import CheckboxGroup from "../components/CheckboxGroup";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { getCoordinatesByCity, fetchAirQuality, getUserLocation, fetchWeatherData, isApiKeyConfigured } from "../services/airApi";
import { COLORS } from "../styles/colors";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [lastCity, setLastCity] = useState("");

  // Filter states
  const [selectedUnit, setSelectedUnit] = useState("aqi");
  const [additionalData, setAdditionalData] = useState([]);

  const mountController = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem("airQualityData");
    const savedLocation = localStorage.getItem("location");
    const savedCity = localStorage.getItem("lastCityQuery") || "";

    if (savedData && savedLocation) {
      const parsedData = JSON.parse(savedData);
      const parsedLocation = JSON.parse(savedLocation);
      setAirQualityData(parsedData);
      setLocation(parsedLocation);
      if (parsedLocation?.lat && parsedLocation?.lon) {
        setCoordinates({ lat: parsedLocation.lat, lon: parsedLocation.lon });
      }
    }
    setLastCity(savedCity);

    if (!isApiKeyConfigured()) {
      setError("⚠️ API Key belum dikonfigurasi. Silakan tambahkan REACT_APP_OPENWEATHER_API_KEY di file .env");
    }

    // Create a style element for keyframes (more stable than insertRule across environments)
    let styleEl = null;
    try {
      const rule = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
      styleEl = document.createElement("style");
      styleEl.type = "text/css";
      styleEl.appendChild(document.createTextNode(rule));
      document.head.appendChild(styleEl);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Could not inject loader keyframes:", e);
    }

    // create AbortController to allow aborting any fetches on unmount
    mountController.current = new AbortController();

    return () => {
      // Cleanup: remove injected style element if we created one
      try {
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
      } catch (removeErr) {
        // eslint-disable-next-line no-console
        console.warn("Failed to remove injected style element:", removeErr);
      }

      // Abort any pending requests that used this controller
      try {
        if (mountController.current) {
          mountController.current.abort();
        }
      } catch (abortErr) {
        // eslint-disable-next-line no-console
        console.warn("Error aborting controller on unmount:", abortErr);
      }

      // Debug log for unmount
      // eslint-disable-next-line no-console
      console.log("HomePage unmounted — cleanup executed.");
    };
  }, []);

  // === componentDidUpdate equivalent: run when airQualityData changes ===
  useEffect(() => {
    if (!airQualityData) return;
    console.log("airQualityData updated:", airQualityData);
  }, [airQualityData]);

  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      // Get coordinates from city name
      const coords = await getCoordinatesByCity(cityName, { signal: mountController.current?.signal });
      setLocation(coords);
      setCoordinates({ lat: coords.lat, lon: coords.lon });

      // Fetch air quality data
      const airData = await fetchAirQuality(coords.lat, coords.lon, { signal: mountController.current?.signal });
      setAirQualityData(airData);

      // Fetch additional weather data if selected
      if (["weather", "wind", "pressure"].some((x) => additionalData.includes(x))) {
        try {
          const weather = await fetchWeatherData(coords.lat, coords.lon, { signal: mountController.current?.signal });
          setWeatherData(weather);
        } catch (wErr) {
          if (wErr.name === "AbortError") {
            // fetch was aborted (likely unmount) — silently ignore
            // eslint-disable-next-line no-console
            console.log("Weather fetch aborted");
          } else {
            // eslint-disable-next-line no-console
            console.warn("Gagal fetch cuaca:", wErr);
          }
        }
      }

      // Save to localStorage
      localStorage.setItem("airQualityData", JSON.stringify(airData));
      localStorage.setItem("location", JSON.stringify(coords));
      localStorage.setItem("lastCityQuery", cityName);
      setLastCity(cityName);
    } catch (err) {
      if (err.name === "AbortError") {
        // request was aborted; do not set an error
        // eslint-disable-next-line no-console
        console.log("Search aborted");
      } else {
        setError(err.message || "Gagal mengambil data. Silakan coba lagi.");
        console.error("Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user's current location
      const coords = await getUserLocation();
      setCoordinates(coords);

      // Fetch air quality data
      const airData = await fetchAirQuality(coords.lat, coords.lon, { signal: mountController.current?.signal });
      setAirQualityData(airData);

      // Set location info
      setLocation({
        name: "Lokasi Anda",
        country: "",
        lat: coords.lat,
        lon: coords.lon,
      });

      // Fetch additional weather data if selected
      if (["weather", "wind", "pressure"].some((x) => additionalData.includes(x))) {
        try {
          const weather = await fetchWeatherData(coords.lat, coords.lon, { signal: mountController.current?.signal });
          setWeatherData(weather);
        } catch (wErr) {
          if (wErr.name === "AbortError") {
            // ignore
            // eslint-disable-next-line no-console
            console.log("Weather fetch aborted (use current location)");
          } else {
            // eslint-disable-next-line no-console
            console.warn("Gagal fetch cuaca:", wErr);
          }
        }
      }

      // Save to localStorage
      localStorage.setItem("airQualityData", JSON.stringify(airData));
      localStorage.setItem(
        "location",
        JSON.stringify({
          name: "Lokasi Anda",
          country: "",
          lat: coords.lat,
          lon: coords.lon,
        })
      );
    } catch (err) {
      if (err.name === "AbortError") {
        // aborted
        // eslint-disable-next-line no-console
        console.log("Use current location flow aborted");
      } else {
        setError(err.message || "Gagal mengambil lokasi. Pastikan Anda mengizinkan akses lokasi.");
        console.error("Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch cuaca saat checkbox terkait aktif dan koordinat tersedia
  useEffect(() => {
    const needWeather = ["weather", "wind", "pressure"].some((x) => additionalData.includes(x));
    if (needWeather && coordinates) {
      (async () => {
        try {
          const weather = await fetchWeatherData(coordinates.lat, coordinates.lon, { signal: mountController.current?.signal });
          setWeatherData(weather);
        } catch (e) {
          if (e.name === "AbortError") {
            console.log("Weather fetch aborted by controller");
          } else {
            console.warn("Gagal fetch cuaca saat toggle checkbox:", e);
          }
        }
      })();
    }
  }, [additionalData, coordinates]);

  const handleViewDetail = () => {
    if (coordinates) {
      navigate("/detail", {
        state: {
          coordinates,
          location,
          airQualityData,
        },
      });
    }
  };

  const unitOptions = [
    { value: "aqi", label: "AQI (Air Quality Index)" },
    { value: "pm25", label: "PM2.5 (μg/m³)" },
    { value: "pm10", label: "PM10 (μg/m³)" },
    { value: "co", label: "CO (Carbon Monoxide)" },
    { value: "no2", label: "NO₂ (Nitrogen Dioxide)" },
    { value: "o3", label: "O₃ (Ozone)" },
  ];

  const additionalDataOptions = [
    { value: "weather", label: "🌡️ Suhu & Kelembapan" },
    { value: "wind", label: "💨 Kecepatan Angin" },
    { value: "pressure", label: "🌊 Tekanan Udara" },
  ];

  return (
    <div style={styles.page}>
      <HeroSection />

      <div style={styles.container}>
        <LocationInput onSearch={handleSearch} onUseCurrentLocation={handleUseCurrentLocation} loading={loading} defaultCity={lastCity} />

        {/* Filter Section */}
        {airQualityData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={styles.filterSection}>
            <div style={styles.filterCard}>
              <Dropdown label="📊 Pilih Satuan Pengukuran" value={selectedUnit} onChange={setSelectedUnit} options={unitOptions} fullWidth />

              <CheckboxGroup label="📋 Data Tambahan" options={additionalDataOptions} selectedValues={additionalData} onChange={setAdditionalData} />
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.errorCard}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorText}>{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.loadingCard}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Mengambil data kualitas udara...</p>
          </motion.div>
        )}

        {/* Results Section */}
        {airQualityData && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={styles.resultsSection}>
            <PollutionCard data={airQualityData} location={location} showDetails={true} selectedUnit={selectedUnit} />

            {/* Weather Info (if selected) */}
            {weatherData && ["weather", "wind", "pressure"].some((x) => additionalData.includes(x)) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={styles.weatherCard}>
                <h3 style={styles.weatherTitle}>🌡️ Informasi Cuaca</h3>
                <div style={styles.weatherGrid}>
                  {additionalData.includes("weather") && (
                    <>
                      <div style={styles.weatherItem}>
                        <span style={styles.weatherLabel}>Suhu</span>
                        <span style={styles.weatherValue}>{weatherData.main?.temp}°C</span>
                      </div>
                      <div style={styles.weatherItem}>
                        <span style={styles.weatherLabel}>Kelembapan</span>
                        <span style={styles.weatherValue}>{weatherData.main?.humidity}%</span>
                      </div>
                    </>
                  )}
                  {additionalData.includes("wind") && (
                    <div style={styles.weatherItem}>
                      <span style={styles.weatherLabel}>Kecepatan Angin</span>
                      <span style={styles.weatherValue}>{weatherData.wind?.speed} m/s</span>
                    </div>
                  )}
                  {additionalData.includes("pressure") && (
                    <div style={styles.weatherItem}>
                      <span style={styles.weatherLabel}>Tekanan Udara</span>
                      <span style={styles.weatherValue}>{weatherData.main?.pressure} hPa</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <PollutantChart data={airQualityData} type="current" selectedUnit={selectedUnit} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={styles.actionSection}>
              <Button onClick={handleViewDetail} variant="primary" size="large" disabled={!coordinates}>
                📊 Lihat Detail & Grafik Historis
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* No Data State */}
        {!airQualityData && !loading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.noDataCard}>
            <span style={styles.noDataIcon}>🔍</span>
            <p style={styles.noDataText}>Masukkan nama kota atau gunakan lokasi Anda untuk melihat kualitas udara</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    paddingTop: "100px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  },
  filterSection: {
    marginTop: "2rem",
  },
  filterCard: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  errorCard: {
    marginTop: "2rem",
    padding: "1.5rem",
    background: "rgba(181, 82, 57, 0.2)",
    border: `2px solid ${COLORS.danger}`,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  errorIcon: {
    fontSize: "2rem",
  },
  errorText: {
    color: COLORS.textLight,
    fontSize: "1rem",
    margin: 0,
  },
  loadingCard: {
    marginTop: "3rem",
    padding: "3rem",
    textAlign: "center",
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
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
  resultsSection: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  weatherCard: {
    background: "rgba(76, 140, 158, 0.15)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(249, 249, 244, 0.25)`,
    borderRadius: "24px",
    padding: "2rem",
  },
  weatherTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: "1.5rem",
  },
  weatherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1.5rem",
  },
  weatherItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
    background: "rgba(249, 249, 244, 0.05)",
    borderRadius: "12px",
    border: `1px solid rgba(249, 249, 244, 0.1)`,
  },
  weatherLabel: {
    fontSize: "0.9rem",
    color: "rgba(249, 249, 244, 0.7)",
    fontWeight: "500",
  },
  weatherValue: {
    fontSize: "1.5rem",
    color: COLORS.textLight,
    fontWeight: "600",
  },
  actionSection: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },
  noDataCard: {
    marginTop: "3rem",
    padding: "3rem",
    textAlign: "center",
    background: "rgba(76, 140, 158, 0.1)",
    borderRadius: "24px",
    border: `1px dashed rgba(249, 249, 244, 0.3)`,
  },
  noDataIcon: {
    fontSize: "4rem",
    display: "block",
    marginBottom: "1rem",
  },
  noDataText: {
    color: "rgba(249, 249, 244, 0.7)",
    fontSize: "1.1rem",
  },
};

// (Loader keyframes are injected in a component useEffect above)

export default HomePage;
