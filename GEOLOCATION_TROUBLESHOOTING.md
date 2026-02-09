# Panduan Troubleshooting Geolocation

## Jika "Gunakan Lokasi Saat Ini" Tidak Bekerja

### Kemungkinan Penyebab:

1. **Browser Tidak Mengizinkan Akses Lokasi**

   - Pastikan Anda mengklik "Allow" atau "Izinkan" saat browser meminta izin akses lokasi
   - Periksa ikon gembok di address bar → Site Settings → Location → Pastikan diatur ke "Allow"

2. **GPS/Layanan Lokasi Tidak Aktif**

   - **Windows**: Settings → Privacy → Location → Pastikan "Location services" aktif
   - **Mac**: System Preferences → Security & Privacy → Privacy → Location Services
   - **Android/iOS**: Settings → Location/Privacy → Pastikan Location Services aktif

3. **WiFi/Koneksi Internet Lemah**

   - Browser menggunakan WiFi triangulation untuk menentukan lokasi
   - Pastikan WiFi aktif dan terhubung dengan baik
   - Atau aktifkan data seluler jika menggunakan perangkat mobile

4. **Perangkat Desktop Tanpa GPS**
   - Beberapa PC desktop tidak memiliki modul GPS
   - Gunakan WiFi untuk estimasi lokasi atau gunakan pencarian manual dengan nama kota

### Solusi:

✅ **Gunakan Pencarian Manual**

- Cukup ketik nama kota Anda (contoh: Jakarta, Surabaya, Bandung)
- Ini cara paling reliable dan cepat!

✅ **Refresh Browser & Coba Lagi**

- Kadang browser perlu di-refresh untuk mengaktifkan geolocation
- Tekan Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)

✅ **Coba Browser Lain**

- Chrome, Edge, Firefox, dan Safari memiliki implementasi geolocation yang berbeda
- Jika satu browser gagal, coba yang lain

### Pesan Error dan Artinya:

| Pesan Error                              | Arti                                     | Solusi                                                          |
| ---------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| "Akses lokasi ditolak oleh browser"      | User klik "Block" saat diminta izin      | Klik ikon gembok di address bar → Reset permissions             |
| "Lokasi tidak dapat dideteksi"           | GPS/WiFi tidak aktif atau tidak tersedia | Aktifkan GPS/WiFi atau gunakan pencarian manual                 |
| "Waktu tunggu habis saat mencari lokasi" | Koneksi lambat atau GPS lemah            | Tunggu beberapa detik, coba lagi, atau gunakan pencarian manual |

### Catatan Teknis:

- Aplikasi menggunakan dua tahap fallback:
  1. High accuracy (GPS) dengan timeout 10 detik
  2. Normal accuracy (WiFi/IP) dengan timeout 20 detik dan cache 5 menit
- Jika kedua metode gagal, gunakan pencarian manual
- Geolocation hanya bekerja di HTTPS atau localhost (requirement browser)

### Rekomendasi:

🌟 **Untuk Pengalaman Terbaik:**

- Gunakan pencarian manual dengan nama kota untuk hasil tercepat
- Geolocation cocok untuk mobile device dengan GPS aktif
- Desktop user disarankan menggunakan pencarian manual
