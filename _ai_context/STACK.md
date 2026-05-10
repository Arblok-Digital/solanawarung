# SOLANAWARUNG — TECH STACK & PROJECT STRUCTURE
> AI Agent: Baca ini supaya kamu tau struktur project dan jangan buat file di tempat yang salah.

---

## TECH STACK

### Core Platform
- **Build Tool**: Google AI Studio Build Mode (Antigravity)
- **Deploy**: Firebase Hosting / Google Cloud Run
- **Runtime**: Node.js (versi sesuai AI Studio default)

### Frontend
- Framework sesuai yang di-generate Antigravity (React atau vanilla JS)
- CSS: Tailwind atau CSS modules
- Bahasa UI: Indonesia

### Backend & Database
- **Firebase Auth**: Google OAuth untuk login
- **Firestore**: Database utama — semua data off-chain
- **Firebase Storage**: Upload foto produk
- **Firebase Functions** (kalau dibutuhkan): Serverless backend logic

### AI
- **Gemini Vision**: Analisis foto produk → generate listing
- **Gemini Text**: Analytics bisnis → saran dalam bahasa Indonesia
- **Model**: gemini-1.5-flash (cepat dan hemat quota)

### Blockchain
- **Network**: Solana Devnet (BUKAN mainnet)
- **Program**: Anchor smart contract untuk escrow
- **Token**: Mock CBDC sebagai SPL Token
- **Wallet**: Phantom Wallet (untuk demo)
- **SDK**: @solana/web3.js

### External (Post-kompetisi saja)
- WhatsApp: Twilio atau WATI
- Logistics: Shipper atau Biteship API

---

## STRUKTUR FOLDER

```
/solanawarung
├── _ai_context/              ← FOLDER INI — context untuk AI agent
│   ├── VISION.md             ← Visi misi dan positioning
│   ├── PROGRESS.md           ← Progress tracker per step
│   ├── RULES.md              ← Aturan wajib
│   └── STACK.md              ← File ini
│
├── src/
│   ├── app/ atau pages/      ← Halaman utama
│   │   ├── page.tsx          ← Homepage marketplace
│   │   ├── login/            ← Halaman login
│   │   ├── product/[id]/     ← Detail produk
│   │   ├── checkout/         ← Alur pembayaran
│   │   ├── wallet/           ← Dompet CBDC
│   │   ├── seller/
│   │   │   ├── dashboard/    ← Dashboard seller
│   │   │   ├── add-product/  ← Tambah produk + Gemini Vision
│   │   │   └── orders/       ← Kelola pesanan
│   │   ├── orders/           ← Riwayat pesanan buyer
│   │   └── about/            ← Narasi CBDC + visi
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── WalletBalance.tsx
│   │   ├── SalesChart.tsx
│   │   └── AIInsightCard.tsx
│   │
│   ├── lib/
│   │   ├── firebase.ts       ← Init Firebase app, auth, firestore
│   │   ├── gemini.ts         ← Init Gemini client + helper functions
│   │   ├── solana.ts         ← Solana connection + helper functions
│   │   └── escrow.ts         ← Interface ke Anchor program
│   │
│   └── hooks/
│       ├── useAuth.ts        ← Firebase auth state
│       ├── useWallet.ts      ← Solana wallet + balance
│       └── useTokenBalance.ts← CBDC token balance
│
├── programs/                 ← Anchor smart contract (Rust)
│   └── solanawarung-escrow/
│       └── src/lib.rs
│
├── scripts/
│   └── create-mint.ts        ← Script buat SPL Token mint
│
├── public/                   ← Static assets
├── .env.local                ← API keys (JANGAN di-commit)
├── .gitignore                ← Pastikan .env.local ada di sini
└── package.json
```

---

## FIRESTORE SCHEMA

### Collection: `users`
```
{
  uid: string,
  email: string,
  nama: string,
  foto: string (URL),
  role: "buyer" | "seller",
  walletAddress: string (Solana pubkey),
  createdAt: timestamp
}
```

### Collection: `products`
```
{
  id: string,
  nama: string,
  kategori: "Makanan dan Minuman" | "Kerajinan Tangan" | "Pakaian" | "Pertanian" | "Elektronik" | "Lainnya",
  deskripsi: string,
  harga: number (dalam Rupiah),
  stok: number,
  berat: number (gram),
  foto: string (Storage URL),
  sellerId: string (uid),
  namaToko: string,
  status: "aktif" | "nonaktif",
  createdAt: timestamp
}
```

### Collection: `orders`
```
{
  id: string,
  buyerId: string,
  sellerId: string,
  productId: string,
  namaProduct: string,
  harga: number,
  status: "menunggu" | "selesai" | "dibatalkan",
  escrowId: string,
  txHash: string (Solana tx),
  createdAt: timestamp
}
```

### Collection: `escrow`
```
{
  id: string,
  orderId: string,
  buyerId: string,
  sellerId: string,
  jumlah: number,
  status: "menunggu" | "selesai" | "dibatalkan",
  createdAt: timestamp
}
```

### Collection: `wallets`
```
{
  uid: string,
  saldo: number (dalam Rupiah),
  updatedAt: timestamp
}
```

### Collection: `transactions`
```
{
  id: string,
  uid: string,
  jumlah: number,
  jenis: "masuk" | "keluar",
  keterangan: string,
  status: "berhasil" | "gagal",
  timestamp: timestamp
}
```

---

## ENVIRONMENT VARIABLES

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Gemini
GEMINI_API_KEY=

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_CBDC_MINT=
SOLANA_PROGRAM_ID=
```

---

## SMART CONTRACT INFO
- **Network**: Solana Devnet
- **Framework**: Anchor
- **Program**: solanawarung-escrow
- **Instructions**:
  - `init_escrow(amount)` — buyer lock dana ke escrow account
  - `release_funds()` — seller konfirmasi, dana release ke seller wallet
  - `cancel_order()` — refund ke buyer kalau order dibatalkan
- **Token**: SPL Token (Mock CBDC Digital Rupiah)
- **Program ID**: Cek di .env.local setelah deploy

---

## GEMINI FUNCTIONS

### analyzeProductImage(imageBase64)
- **Input**: Foto produk dalam base64
- **Output**: `{ nama, kategori, deskripsi, estimasiHarga }`
- **Prompt bahasa**: Indonesia
- **Model**: gemini-1.5-flash

### getBusinessInsight(orderData)
- **Input**: Data order seller 30 hari terakhir
- **Output**: `{ ringkasan, rekomendasi[], produkPerluRestock[], ideProdukBaru }`
- **Prompt bahasa**: Indonesia — konteks UMKM
- **Model**: gemini-1.5-flash
