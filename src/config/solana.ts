import { Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export const CBDC_MINT = process.env.VITE_CBDC_MINT_ADDRESS ? new PublicKey(process.env.VITE_CBDC_MINT_ADDRESS) : null;
