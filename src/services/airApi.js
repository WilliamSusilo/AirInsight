// OpenWeatherMap API Service
// API Key - Ganti dengan API key kamu dari https://openweathermap.org/api

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

/**
 * Fetch koordinat geografis berdasarkan nama kota
 * @param {string} cityName - Nama kota
 * @returns {Promise<{lat: number, lon: number, name: string, country: string}>}
 */
export const getCoordinatesByCity = async (cityName) => {
  try {
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gagal mengambil koordinat: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error(`Kota "${cityName}" tidak ditemukan`);
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].name,
      country: data[0].country,
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

/**
 * Fetch data kualitas udara berdasarkan koordinat
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Data polusi udara
 */
export const fetchAirQuality = async (lat, lon) => {
  try {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data polusi udara: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching air quality:", error);
    throw error;
  }
};

/**
 * Fetch data historis kualitas udara
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} start - Unix timestamp start (opsional, default: 7 hari lalu)
 * @param {number} end - Unix timestamp end (opsional, default: sekarang)
 * @returns {Promise<Object>} Data historis polusi udara
 */
export const fetchAirQualityHistory = async (lat, lon, start, end, { signal } = {}) => {
  try {
    // Default: 7 hari terakhir
    const endTime = end || Math.floor(Date.now() / 1000);
    const startTime = start || endTime - 7 * 24 * 60 * 60;

    const url = `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${startTime}&end=${endTime}&appid=${API_KEY}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data historis: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching air quality history:", error);
    throw error;
  }
};

/**
 * Fetch data cuaca untuk informasi tambahan
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Data cuaca
 */
export const fetchWeatherData = async (lat, lon) => {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data cuaca: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Get lokasi user menggunakan Geolocation API
 * @returns {Promise<{lat: number, lon: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung oleh browser ini. Gunakan pencarian manual dengan nama kota."));
      return;
    }

    const tryGetPosition = (options) =>
      new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            res({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => rej(error),
          options
        );
      });

    // Percobaan 1: akurasi tinggi, timeout 10s
    tryGetPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
      .then(resolve)
      .catch(async (firstError) => {
        console.warn("Percobaan pertama gagal:", firstError.message);

        // Fallback: akurasi normal, izinkan cache 5 menit, timeout 20s
        try {
          const pos = await tryGetPosition({ enableHighAccuracy: false, timeout: 20000, maximumAge: 5 * 60 * 1000 });
          resolve(pos);
        } catch (error) {
          let errorMessage = "Gagal mendapatkan lokasi";
          let suggestion = "";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Akses lokasi ditolak oleh browser";
              suggestion = "Silakan izinkan akses lokasi di pengaturan browser Anda, atau gunakan pencarian manual dengan nama kota.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Lokasi tidak dapat dideteksi";
              suggestion = "Perangkat Anda mungkin tidak memiliki GPS atau layanan lokasi sedang tidak aktif. Silakan aktifkan GPS/WiFi atau gunakan pencarian manual dengan nama kota.";
              break;
            case error.TIMEOUT:
              errorMessage = "Waktu tunggu habis saat mencari lokasi";
              suggestion = "Koneksi atau GPS mungkin lambat. Silakan coba lagi atau gunakan pencarian manual dengan nama kota.";
              break;
            default:
              errorMessage = "Terjadi kesalahan saat mengambil lokasi";
              suggestion = "Silakan gunakan pencarian manual dengan nama kota.";
          }

          reject(new Error(`${errorMessage}. ${suggestion}`));
        }
      });
  });
};

/**
 * Helper: Konversi AQI dari komponen polutan
 * OpenWeatherMap API menggunakan skala European AQI (1-5)
 * Fungsi ini mengkonversi ke US AQI (0-500)
 */
export const convertToUSAQI = (components) => {
  const { pm2_5, pm10 } = components;

  // Simplified conversion (untuk demo purposes)
  // Dalam production, gunakan formula konversi resmi EPA
  const pm25AQI = calculatePM25AQI(pm2_5);
  const pm10AQI = calculatePM10AQI(pm10);

  return Math.max(pm25AQI, pm10AQI);
};

// Helper functions untuk konversi individual pollutant
const calculatePM25AQI = (pm25) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round(50 + ((100 - 50) / (35.4 - 12)) * (pm25 - 12));
  if (pm25 <= 55.4) return Math.round(100 + ((150 - 100) / (55.4 - 35.4)) * (pm25 - 35.4));
  if (pm25 <= 150.4) return Math.round(150 + ((200 - 150) / (150.4 - 55.4)) * (pm25 - 55.4));
  if (pm25 <= 250.4) return Math.round(200 + ((300 - 200) / (250.4 - 150.4)) * (pm25 - 150.4));
  return Math.round(300 + ((500 - 300) / (500 - 250.4)) * (pm25 - 250.4));
};

const calculatePM10AQI = (pm10) => {
  if (pm10 <= 54) return Math.round((50 / 54) * pm10);
  if (pm10 <= 154) return Math.round(50 + ((100 - 50) / (154 - 54)) * (pm10 - 54));
  if (pm10 <= 254) return Math.round(100 + ((150 - 100) / (254 - 154)) * (pm10 - 154));
  if (pm10 <= 354) return Math.round(150 + ((200 - 150) / (354 - 254)) * (pm10 - 254));
  if (pm10 <= 424) return Math.round(200 + ((300 - 200) / (424 - 354)) * (pm10 - 354));
  return Math.round(300 + ((500 - 300) / (604 - 424)) * (pm10 - 424));
};

// Export API key checker
export const isApiKeyConfigured = () => {
  return API_KEY && API_KEY !== "YOUR_API_KEY_HERE";
};
