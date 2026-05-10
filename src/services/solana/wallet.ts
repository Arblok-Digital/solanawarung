import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { connection } from '../../config/solana';

export const getSolBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to fetch SOL balance:', error);
    return 0;
  }
};

export const requestAirdrop = async (publicKey: PublicKey): Promise<boolean> => {
  try {
    const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    return true;
  } catch (error) {
    console.error('Airdrop failed:', error);
    return false;
  }
};
