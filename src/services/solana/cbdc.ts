// @ts-nocheck
import { 
  getOrCreateAssociatedTokenAccount, 
  createMintToInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { 
  Transaction, 
  PublicKey, 
  sendAndConfirmTransaction, 
  Keypair 
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
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      mint: CBDC_MINT
    });
    
    if (tokenAccounts.value.length > 0) {
      const amount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return amount || 0;
    }
    return 0;
  } catch (error) {
    console.error('Failed to fetch CBDC balance:', error);
    return 0;
  }
};
