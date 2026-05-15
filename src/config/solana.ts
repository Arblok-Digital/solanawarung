import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Inisialisasi koneksi ke Solana Devnet
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Alamat Public Key untuk Token Digital Rupiah (CBDC) di Devnet
// Ini adalah contoh alamat. Kamu bisa menggantinya dengan alamat mint token SPL
// yang kamu deploy sendiri di Devnet.
// Contoh: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
// Ganti ini dengan alamat token mint kamu di Devnet
export const CBDC_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");