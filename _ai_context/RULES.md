# SOLANAWARUNG — RULES FOR AI AGENTS
> Ini bukan saran. Ini aturan keras. Kalau dilanggar, project bisa rusak.

---

## ATURAN PENGERJAAN

### R01 — SATU TASK PER SESI
Kerjakan hanya satu step per sesi. Selesaikan dulu, verifikasi, baru lanjut. Jangan loncat.

### R02 — BACA CONTEXT DULU
Sebelum mulai apapun, baca VISION.md dan PROGRESS.md. Pahami di mana posisi project sekarang.

### R03 — UPDATE PROGRESS
Setelah selesai mengerjakan satu step, wajib update PROGRESS.md. Ubah status dari 🔄 ke ✅ dan isi catatan.

### R04 — STOP KALAU BLOCKED
Kalau ada error yang tidak bisa diselesaikan dalam 3 percobaan, STOP. Ubah status ke ❌ BLOCKED di PROGRESS.md. Tulis detail errornya. Jangan paksa lanjut.

### R05 — JANGAN KELUAR SCOPE
Kalau sedang Step 03, jangan sekalian ubah layout dari Step 02. Fokus satu step, satu waktu.

### R06 — DEPENDENCIES HARUS TERPENUHI
Jangan kerjakan step yang ada tag "Depends on" kalau dependency-nya belum ✅ SELESAI.

---

## ATURAN KODE

### R07 — NO HARDCODE CREDENTIALS
Jangan pernah tulis API key, secret, atau credential langsung di kode. Gunakan environment variable atau Google Secret Manager.

### R08 — GOOGLE ECOSYSTEM ONLY
Jangan tambahkan library atau service di luar ekosistem Google, kecuali:
- Solana Web3.js (sudah by design, bagian dari core product)
- Library yang sudah ada di package.json existing

### R09 — FIRESTORE TRANSACTIONS UNTUK SALDO
Semua operasi yang melibatkan saldo wallet WAJIB menggunakan Firestore transaction, bukan set/update biasa. Ini untuk mencegah race condition.

### R10 — BAHASA INDONESIA DI UI
Semua teks yang terlihat user harus dalam Bahasa Indonesia. Error message, label form, notifikasi, placeholder — semua Indonesia.

### R11 — FORMAT HARGA
Harga selalu dalam format: `Rp 150.000` (pakai titik sebagai pemisah ribuan, bukan koma).

### R12 — JANGAN HAPUS FILE YANG ADA
Kalau tidak yakin apakah file boleh dihapus atau diubah, jangan lakukan. Tanya dulu atau skip.

---

## ATURAN DESAIN

### R13 — MOBILE FIRST
Semua komponen harus terlihat bagus di layar 375px terlebih dahulu, baru desktop.

### R14 — LOADING STATE WAJIB ADA
Setiap operasi async (fetch data, panggil Gemini, transaksi Solana) WAJIB punya loading state. Spinner, skeleton, atau disabled button — pilih salah satu, tapi harus ada.

### R15 — ERROR MESSAGE YANG RAMAH
Jangan tampilkan raw error dari console ke user. Buat pesan error dalam Bahasa Indonesia yang jelas dan tidak menakutkan. Contoh: "Saldo tidak cukup. Silakan isi saldo terlebih dahulu."

---

## ATURAN GEMINI API

### R16 — SELALU ADA FALLBACK
Kalau Gemini API gagal atau timeout, aplikasi tidak boleh crash. Tampilkan pesan error dan biarkan user input manual.

### R17 — PROMPT DALAM BAHASA INDONESIA
Prompt ke Gemini untuk fitur yang menghasilkan teks user-facing harus dalam Bahasa Indonesia supaya output relevan dengan konteks UMKM Indonesia.

### R18 — JANGAN EXPOSE PROMPT KE USER
Prompt template yang dikirim ke Gemini jangan ditampilkan ke user. Hanya output-nya yang ditampilkan.

---

## STRATEGI ADOPSI UMKM

### R19 — INVISIBLE BLOCKCHAIN
Jangan gunakan istilah teknis Web3 (Escrow, Smart Contract, Gas Fee, PDA) di UI yang terlihat user. Gunakan istilah yang familiar: "Pembayaran Aman", "Sistem Otomatis", "Digital Rupiah", atau "Rekening Bersama".

### R20 — AI AS CO-PILOT
AI hanya memberikan draft/saran. Pastikan user selalu bisa mengedit output dari Gemini (nama produk, harga, deskripsi) sebelum disimpan ke database. Keputusan akhir ada di tangan manusia.

---

## PRIORITAS KALAU WAKTU TERBATAS

Kalau deadline kompetisi mepet, kerjakan dalam urutan ini:
1. ✅ Step 01 — sudah selesai
2. 🔄 Step 02 — UI/UX (SEKARANG)
3. Step 03 — Gemini Vision (fitur paling wow untuk demo)
4. Step 04 — CBDC Wallet
5. Step 05 — Checkout flow
6. Step 07 — Deploy dulu ke Firebase Hosting
7. Step 06 — Dashboard seller (kalau masih ada waktu)
8. Step 08 — Halaman About

Step 09 dan 10 adalah post-kompetisi. Jangan kerjakan kalau deadline mepet.
