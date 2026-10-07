# Panduan Deploy ke Cloudflare Pages

Aplikasi **Cetak Amplop Raport SMK Muhammadiyah Bawang** adalah Single Page Application (SPA) berbasis React + Vite yang 100% kompatibel dan siap di-deploy ke **Cloudflare Pages**.

---

## ⚡ Metode 1: Hubungkan ke GitHub (Otomatis & Direkomendasikan)

Metode ini memberikan Continuous Deployment (otomatis update saat Anda push perubahan):

1. **Buka Cloudflare Dashboard**:
   - Kunjungi [dash.cloudflare.com](https://dash.cloudflare.com/)
   - Masuk ke menu **Workers & Pages** > **Create application** > Tab **Pages** > **Connect to Git**.

2. **Pilih Repositori GitHub** aplikasi ini.

3. **Konfigurasi Pengaturan Build (Build settings)**:
   - **Framework preset**: `Vite` (atau pilih `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (kosongkan atau biarkan default)

4. **Environment Variables** (Opsional):
   - `NODE_VERSION`: `20` (atau `18`)

5. Klik **Save and Deploy**. Cloudflare Pages akan membangun dan memberikan URL publik gratis (misal: `https://cetak-amplop-smkmuhiba.pages.dev`).

---

## 💻 Metode 2: Deploy Manual via Terminal (Wrangler CLI)

Jika Anda ingin deploy langsung dari komputer Anda tanpa GitHub:

1. **Build aplikasi ke folder `dist`**:
   ```bash
   npm run build
   ```

2. **Deploy menggunakan Wrangler**:
   ```bash
   npx wrangler pages deploy dist --project-name=cetak-amplop-smkmuhiba
   ```

3. Wrangler akan meminta login akun Cloudflare (jika belum login) dan langsung mempublikasikan aplikasi Anda ke edge network global Cloudflare!

---

## 📁 Berkas Khusus Cloudflare yang Telah Disiapkan:

- `package-lock.json`: Telah menggantikan `bun.lock` (versi 2) untuk mengatasi error build Cloudflare `Unknown lockfile version: failed to parse lockfile: 'bun.lock'`.
- `.npmrc`: Dikonfigurasi dengan `legacy-peer-deps=true` agar `npm ci` atau `npm install` di Cloudflare Pages berjalan lancar tanpa kendala dependensi.
- `public/_redirects`: Mengatur *Single Page Application fallback* (`/* /index.html 200`) agar saat halaman di-refresh tidak menghasilkan pesan error 404.
- `public/_headers`: Mengatur keamanan browser (X-Frame-Options, MIME sniff protection) dan *cache-control* performa tinggi untuk aset `assets/*`.
- `wrangler.toml`: Konfigurasi nama proyek dan direktori output build Cloudflare Pages.

---

## 🛠️ Catatan Terkait Solusi Error Bun vs NPM di Cloudflare:

1. **Rekomendasi (NPM - Paling Stabil)**:
   - Karena `bun.lock` versi 2 telah dihapus dan digantikan oleh `package-lock.json`, Cloudflare Pages otomatis menggunakan instalasi npm standar yang didukung penuh:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Tidak memerlukan pengaturan Environment Variable tambahan.

2. **Jika Tetap Ingin Menggunakan Bun**:
   - Di dashboard Cloudflare Pages: **Settings** > **Environment variables** > **Add variable**:
     - Name: `BUN_VERSION`
     - Value: `1.4.2`
   - **Build command**: `bun run build`
