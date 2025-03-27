# RESTful-API-Notes-App
Aplikasi catatan interaktif yang memungkinkan pengguna untuk membuat, mengelola, mengarsipkan, dan menghapus catatan. Aplikasi ini menggunakan teknologi Web Components dan berkomunikasi dengan RESTful API untuk menyimpan dan mengambil data.

# Fitur
- ✨ Membuat catatan baru dengan judul dan konten
- 📋 Melihat daftar catatan yang tersimpan
- 🗂️ Mengarsipkan dan membatalkan arsip catatan
- 🗑️ Menghapus catatan yang tidak diperlukan
- 🔄 Indikator loading saat melakukan operasi dengan API
- ⚠️ Feedback error saat terjadi masalah dengan API

# Teknologi yang Digunakan
- Web Components - Untuk membuat komponen yang dapat digunakan kembali
- Webpack - Untuk bundling dan optimasi kode
- Babel - Untuk kompatibilitas JavaScript
- SweetAlert2 - Untuk notifikasi dan dialog yang lebih menarik
- CSS Animations - Untuk transisi dan efek visual yang halus
- Fetch API - Untuk komunikasi dengan backend

# Struktur Proyek
```javascript
notes-app/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── data/
│   │   └── api-service.js     # Layanan API untuk CRUD operations
│   ├── components/
│   │   ├── app-bar.js         # Komponen header aplikasi
│   │   ├── note-form.js       # Form untuk menambah catatan
│   │   ├── note-item.js       # Item catatan individual
│   │   └── notes-grid.js      # Grid untuk menampilkan catatan
│   ├── utils/
│   │   ├── loading-indicator.js  # Indikator loading
│   │   └── alert-helper.js       # Helper untuk feedback/alerts
│   └── app.js                 # Entry point aplikasi
├── webpack.common.js          # Konfigurasi webpack umum
├── webpack.dev.js             # Konfigurasi webpack development
├── webpack.prod.js            # Konfigurasi webpack production
├── .babelrc                   # Konfigurasi Babel
├── .prettierrc                # Konfigurasi Prettier
└── package.json               # Dependencies dan scripts
```

# Instalasi
1. Clone repositori:
   ```bash
   git clone https://github.com/username/notes-app.git
   cd notes-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi dalam mode development:
   ```bash
   npm run start-dev
   ```
4. Build untuk production:
   ```bash
   npm run build
   ```

# API Endpoints
Aplikasi ini menggunakan API dari Dicoding untuk menyimpan dan mengelola data catatan. Endpoint yang digunakan:

- GET /notes - Mendapatkan daftar catatan yang tidak diarsipkan
- GET /notes/archived - Mendapatkan daftar catatan yang diarsipkan
- POST /notes - Membuat catatan baru
- DELETE /notes/{id} - Menghapus catatan
- POST /notes/{id}/archive - Mengarsipkan catatan
- POST /notes/{id}/unarchive - Membatalkan arsip catatan

# Fitur Web Components
Aplikasi ini menggunakan Web Components untuk membuat UI yang modular dan dapat digunakan kembali:

1. AppBar (<app-bar>) - Komponen header aplikasi
2. NoteForm (<note-form>) - Form untuk menambahkan catatan baru
3. NoteItem (<note-item>) - Komponen untuk menampilkan catatan individual
4. NotesGrid (<notes-grid>) - Grid untuk menampilkan kumpulan catatan

# Responsive Design
Aplikasi ini didesain untuk bekerja dengan baik di berbagai ukuran layar, dari desktop hingga mobile. Media queries digunakan untuk menyesuaikan tata letak berdasarkan ukuran viewport.

# Optimasi dan Best Practices
- Menggunakan Shadow DOM untuk enkapsulasi gaya
- Implementasi validasi form secara real-time
- Animasi dan transisi halus untuk pengalaman pengguna yang lebih baik
- Indikator loading saat operasi asinkron
- Penanganan error yang robust
- Kode yang terstruktur dengan prinsip modular
