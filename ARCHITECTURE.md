# 🏛️ Arsitektur SolanaWarung: Peta Teknis & Keputusan Strategis

Dokumen ini adalah "Single Source of Truth" untuk memahami struktur, logika, dan alur kerja proyek SolanaWarung. Gunakan dokumen ini sebagai referensi utama saat debugging atau menambahkan fitur baru untuk menghemat penggunaan token AI.

---

## 🚀 1. Tech Stack Utama
- **Frontend**: React (Vite) + Tailwind CSS (Premium Dark Theme/Glassmorphism).
- **Backend (Serverless)**: Firebase (Auth, Firestore, Storage).
- **Blockchain**: Solana Web3.js (Devnet) - Pembayaran berbasis Escrow & Digital Rupiah.
- **Intelligence**: Google Gemini AI (Vertex AI/Generative AI SDK) - Analisis Produk & Business Insight.

---

## 📂 2. Peta Folder (File Map)

### `src/components/` (UI Layer)
- `/auth/`: `LoginPage.tsx`, `RoleSelector.tsx` (Handle login Google & pemilihan peran).
- `/buyer/`: `BuyerStorefront.tsx` (Pasar), `ProductDetail.tsx`, `WalletPage.tsx` (Top up saldo).
- `/seller/`: `SellerDashboard.tsx` (Katalog produk), `ProductForm.tsx` (Add/Edit dengan AI), `InsightPanel.tsx` (Gemini Analytics).
- `/shared/`: `OrdersPanel.tsx` (Manajemen pesanan dua arah Buyer/Seller).
- `/layout/`: `Header.tsx`, `Sidebar.tsx`, `DashboardLayout.tsx`.
- `/landing/`: `LandingPage.tsx` (High-conversion landing page).

### `src/services/` (Logic Layer)
- `/firebase/`: 
  - `auth.ts`: Sinkronisasi user ke Firestore.
  - `products.ts`: CRUD produk & Real-time subscription.
  - `orders.ts`: Manajemen status pesanan & Escrow flow.
  - `checkout.ts`: Transaksi atomik (pembayaran, stok, & escrow).
- `/solana/`:
  - `escrow.ts`: Smart contract interface untuk menahan dana di blockchain.
  - `wallet.ts`: Utilitas wallet & koneksi provider.
- `/gemini/`:
  - `vision.ts`: Analisis foto produk menjadi teks (Nama, Deskripsi, Harga).
  - `analytics.ts`: Menghasilkan insight bisnis & prediksi tren mingguan.

### `src/types/`
- `index.ts`: Definisi interface global (`Product`, `Order`, `User`, `OrderStatus`).

---

## 🔄 3. Alur Logika Kritis (Core Flows)

### A. "Invisible Blockchain" Checkout Flow
1. **Buyer** klik 'Beli'.
2. `checkout.ts` memicu transaksi atomik di Firestore:
   - Saldo Buyer dipotong.
   - Dana masuk ke koleksi `escrow` (Status: `HOLD`).
   - Order dibuat dengan status `PENDING_ESCROW`.
3. **Seller** melihat pesanan di `OrdersPanel` dan klik 'Kirim'.
   - Status berubah jadi `ESCROW`.
4. **Buyer** menerima barang dan klik 'Selesai'.
   - Dana di `escrow` dilepas ke saldo Seller.
   - Status Order jadi `COMPLETED`.

### B. AI-Powered Product Listing
1. **Seller** upload foto di `ProductForm`.
2. `gemini/vision.ts` mengirim gambar ke model Gemini 1.5 Pro.
3. Gemini mengembalikan JSON: `{ name, description, category, suggestedPrice }`.
4. Form terisi otomatis, Seller tinggal konfirmasi.

---

## ⚖️ 4. Keputusan Arsitektur (ADR)

| Keputusan | Rationale (Alasan) |
| :--- | :--- |
| **Atomic Transactions** | Menjamin konsistensi data antara saldo, stok, dan order dalam satu siklus. |
| **Shared OrdersPanel** | Mengurangi duplikasi kode dengan menggunakan satu komponen untuk dua role (Buyer/Seller). |
| **Enum-Based Status** | Menggunakan `OrderStatus` enum untuk mencegah *magic strings* dan typo di codebase. |
| **Dark Mode Priority** | Menciptakan vibe premium dan modern sesuai identitas Web3/Solana. |

---

## 🛠️ 5. Cara Debugging Cepat
- **Masalah UI**: Cek `src/components/layout/` untuk struktur wrapper.
- **Masalah Saldo**: Cek `src/services/firebase/checkout.ts` (Transaction logic).
- **Masalah Blockchain**: Cek `src/services/solana/` dan log `transactionSignature`.
- **Masalah AI**: Cek API Key di `.env` dan prompt di `src/services/gemini/`.

---
*Terakhir diupdate: 10 Mei 2026 oleh Antigravity.*
