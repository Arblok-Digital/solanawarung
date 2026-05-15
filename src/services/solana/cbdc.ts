// @ts-nocheck
import { 
  getOrCreateAssociatedTokenAccount, 
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { 
  Transaction, 
  PublicKey, 
  sendAndConfirmTransaction, 
  Keypair,
  SystemProgram
} from '@solana/web3.js';
import { connection, CBDC_MINT } from '../../config/solana';

export const getOrCreateCBDCTokenAccount = async (walletPublicKey: PublicKey, signTransaction: any) => {
  if (!CBDC_MINT) {
    console.error('CBDC_MINT address not configured in .env');
    return null;
  }

  try {
    // In a real app with a wallet provider, we'd use the wallet's signTransaction
    // But for getOrCreateAssociatedTokenAccount, it typically needs a payer Keypair
    // For demo purposes on devnet, we might need a workaround or just check if it exists
    
    // Check if ATA exists
    const ata = await PublicKey.findProgramAddress(
      [
        walletPublicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        CBDC_MINT.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const account = await getAccount(connection, ata[0]);
      return account.address.toString();
    } catch (e) {
      console.log('ATA does not exist, needs creation');
      // Here we would ideally trigger a transaction via the wallet to create the ATA
      // For now, let's return the address and handle creation in the checkout flow
      return ata[0].toString();
    }
  } catch (error) {
    console.error('Error in CBDC token account logic:', error);
    return null;
  }
};

export const getCBDCBalance = async (walletPublicKey: PublicKey): Promise<number> => {
  if (!CBDC_MINT) return 0;
  
  try {
    const ata = await getAssociatedTokenAddress(CBDC_MINT, walletPublicKey);
    const balance = await connection.getTokenAccountBalance(ata);
    return balance.value.uiAmount || 0;
  } catch (error) {
    // Jika error, berarti ATA belum dibuat, anggap saldo 0
    return 0;
  }
};

/**
 * MINT CBDC (Digital Rupiah)
 * Untuk simulasi pengisian saldo IDR-D di Devnet
 */
export const createMintCBDCTransaction = async (walletPublicKey: PublicKey, amount: number) => {
  if (!CBDC_MINT) throw new Error("CBDC Mint not configured");

  const ata = await getAssociatedTokenAddress(CBDC_MINT, walletPublicKey);
  
  // Catatan: createMintToInstruction membutuhkan Mint Authority signature.
  // Di mode simulasi JuaraVibeCoding, biasanya kita asumsikan authority 
  // dipegang oleh pengembang atau faucet khusus.
  const tx = new Transaction().add(
    createMintToInstruction(
      CBDC_MINT,
      ata,
      walletPublicKey, // Asumsi user adalah authority untuk dummy mint ini
      amount * 100, // Menyesuaikan decimal (asumsi 2 decimal untuk Rupiah)
      [],
      TOKEN_PROGRAM_ID
    )
  );

  return tx;
};
