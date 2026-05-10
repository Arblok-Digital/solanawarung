import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// Setup connection to Solana Devnet
export const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const getSolBalance = async (publicKey: PublicKey) => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to fetch SOL balance:', error);
    return 0;
  }
};

export const requestAirdrop = async (publicKey: PublicKey) => {
  try {
    const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    return true;
  } catch (error) {
    console.error('Airdrop failed:', error);
    return false;
  }
};
