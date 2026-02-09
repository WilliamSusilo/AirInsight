# 🌍 AirInsight - Karakteristik dan Keadaan Polusi Udara

Platform monitoring kualitas udara real-time dengan visualisasi edukatif dan UI futuristik.

**Dibuat oleh:** William Susilo - 56220008  
**Mata Kuliah:** Web Technology 3 Semester 7  
**Teknologi:** React, Framer Motion, Recharts, OpenWeatherMap API

---

## 🚀 Quick Start

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

---

## 📋 Fitur Utama

### ✅ Monitoring Real-Time

- Data polusi udara real-time dari OpenWeatherMap API
- AQI (Air Quality Index) dengan status warna
- 6 polutan utama: PM2.5, PM10, CO, NO₂, SO₂, O₃

### ✅ Pencarian Lokasi Fleksibel

- **Pencarian Manual**: Ketik nama kota (Jakarta, Surabaya, Bandung, dll)
- **Lokasi Otomatis**: Gunakan GPS perangkat (dengan fallback otomatis)
- Persistent search: input tersimpan saat navigasi

### ✅ Filter & Visualisasi

- **Dropdown Unit**: Fokus pada polutan tertentu (PM2.5, O₃, dll)
- **Data Tambahan**: Suhu, kelembapan, angin, tekanan udara
- **Grafik Interaktif**: Bar chart dengan tooltip informatif
- **Grafik Historis**: Tren 24 jam terakhir

### ✅ Halaman Detail

- RadioGroup filter kategori (Kualitas Udara, Emisi Kendaraan, Industri)
- Insight edukatif per kategori
- Informasi kesehatan untuk setiap polutan

### ✅ UX Modern

- Animasi smooth dengan Framer Motion
- Glassmorphism design
- Responsive layout
- Scroll-to-top on navigation
- Loading & error states yang informatif

---

## 🛠️ Setup & Konfigurasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup API Key

Dapatkan API key gratis dari [OpenWeatherMap](https://openweathermap.org/api):

1. Buka https://openweathermap.org/api
2. Klik "Sign Up" dan buat akun gratis
3. Dapatkan API key dari dashboard
4. Buat file `.env` di root project:

```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Jalankan Development Server

```bash
npm start
```

Aplikasi akan berjalan di http://localhost:3000

---

## 🐛 Troubleshooting

### Error: "Lokasi tidak dapat dideteksi"

Jika fitur "Gunakan Lokasi Saat Ini" tidak bekerja:

**Penyebab Umum:**

- GPS/WiFi tidak aktif
- Browser tidak mendapat izin akses lokasi
- Perangkat desktop tanpa GPS

**Solusi:**

1. ✅ **Gunakan Pencarian Manual** (paling reliable!)
   - Ketik nama kota: Jakarta, Surabaya, Bandung, dll
2. Pastikan GPS/Location Services aktif:
   - **Windows**: Settings → Privacy → Location
   - **Mac**: System Preferences → Security & Privacy → Location Services
3. Izinkan akses lokasi di browser:
   - Klik ikon gembok di address bar
   - Site Settings → Location → Allow

📖 Lihat [GEOLOCATION_TROUBLESHOOTING.md](./GEOLOCATION_TROUBLESHOOTING.md) untuk panduan lengkap.

### Error: "API Key belum dikonfigurasi"

Pastikan file `.env` sudah dibuat dengan format yang benar:

```env
REACT_APP_OPENWEATHER_API_KEY=4d37375e9dd5b48487d0dacca80b6ebb
```

Restart development server setelah menambahkan `.env`:

```bash
# Stop server (Ctrl+C)
npm start
```

---

## 📁 Struktur Proyek

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── HeroSection.jsx
│   ├── LocationInput.jsx
│   ├── PollutionCard.jsx
│   ├── PollutantChart.jsx
│   ├── Dropdown.jsx
│   ├── CheckboxGroup.jsx
│   ├── RadioGroup.jsx
│   ├── Button.jsx
│   └── Footer.jsx
│
├── pages/              # Page components
│   ├── HomePage.jsx
│   └── DetailPage.jsx
│
├── services/           # API services
│   └── airApi.js
│
├── styles/             # Global styles
│   ├── colors.js
│   └── global.css
│
├── App.js             # Main app with routing
└── index.js           # Entry point
```

---

## 🎨 Tema Warna

Palet warna environmentally-themed:

- **Primary**: `#2E3A3F` (Charcoal Gray) - Background
- **Secondary**: `#9FBF9E` (Soft Sage Green)
- **Accent**: `#4C8C9E` (Muted Teal Blue) - Navbar
- **Action**: `#3A7D44` (Emerald Green) - Buttons
- **Warning**: `#D5A021` (Amber Dust)
- **Danger**: `#B55239` (Rusty Red)
- **Text**: `#F9F9F4` (Ivory White)

---

## 📊 API Reference

Menggunakan [OpenWeatherMap Air Pollution API](https://openweathermap.org/api/air-pollution):

- **Current Air Pollution**: `/data/2.5/air_pollution`
- **Historical Data**: `/data/2.5/air_pollution/history`
- **Geocoding**: `/geo/1.0/direct`
- **Weather Data**: `/data/2.5/weather`

---

## 🙏 Credits

- **OpenWeatherMap** untuk Air Pollution API
- **Create React App** untuk project scaffolding
- **Framer Motion** untuk animasi
- **Recharts** untuk visualisasi chart
- **React Router** untuk navigation

---

## 📄 License

This project is created for educational purposes (UTS Web Technology 3).

**William Susilo - 56220008**  
Universitas Kristen Petra  
Semester 7 - 2025

---

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
