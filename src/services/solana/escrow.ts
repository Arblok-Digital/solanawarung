// @ts-nocheck
import * as anchor from '@coral-xyz/anchor';
const { Program, AnchorProvider, BN } = anchor;

if (typeof window !== 'undefined') {
  window.BN = BN;
  window.anchor = anchor;
}
import { 
  PublicKey, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { connection, CBDC_MINT } from '../../config/solana';
import { Buffer } from 'buffer';

// Force global polyfills for libraries that expect them
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Actual Program ID from deployment
const PROGRAM_ID_STR = "Ga6pierAanLbJPV6FsxZyB8zgXhbr5spbEB5tce42EVm";
const PROGRAM_ID = new PublicKey(PROGRAM_ID_STR);



const IDL = {
  "address": PROGRAM_ID_STR,
  "version": "0.1.0",
  "name": "solanawarung_escrow",
  "instructions": [
    {
      "name": "initializeEscrow",
      "discriminator": [243, 160, 77, 153, 11, 92, 48, 209],
      "accounts": [
        { "name": "escrowAccount", "isMut": true, "isSigner": false },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false },
        { "name": "buyer", "isMut": true, "isSigner": true },
        { "name": "seller", "isMut": false, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false },
        { "name": "buyerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "orderId", "type": "string" },
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "releaseFunds",
      "discriminator": [225, 88, 91, 108, 126, 52, 2, 26],
      "accounts": [
        { "name": "escrowAccount", "isMut": true, "isSigner": false },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false },
        { "name": "sellerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "buyer", "isMut": true, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    }
  ]
};

export const createEscrowTransaction = async (
  wallet: any,
  sellerPublicKey: PublicKey,
  orderId: string,
  amount: number
) => {
  if (!CBDC_MINT) throw new Error("CBDC Mint not configured");
  
  console.log("Creating Escrow Transaction:", { orderId, amount, hasWallet: !!wallet, hasPubkey: !!wallet?.publicKey });

  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected or public key missing");
  }

  // Wrap wallet for Anchor compatibility
  const anchorWallet = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  console.log("Initializing Provider & Program...");
  const provider = new AnchorProvider(connection, anchorWallet, { preflightCommitment: 'confirmed' });
  const program = new Program(IDL, provider);

  console.log("Deriving PDAs...");
  const [escrowAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("escrow"),
      wallet.publicKey.toBuffer(),
      sellerPublicKey.toBuffer(),
      Buffer.from(orderId),
    ],
    PROGRAM_ID
  );

  const [escrowTokenAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("token"),
      escrowAccount.toBuffer()
    ],
    PROGRAM_ID
  );

  const buyerTokenAccount = await getAssociatedTokenAddress(CBDC_MINT, wallet.publicKey);
  
  // Convert amount to u64 (assuming CBDC has 9 decimals, or 0 if user wants absolute)
  // Let's assume CBDC has 2 decimals for Rupiah or as configured in mint.
  // For now, we use the raw amount passed from UI.
  const amountU64 = new BN(amount);

  return await program.methods
    .initializeEscrow(orderId, amountU64)
    .accounts({
      escrowAccount: escrowAccount.toBase58(),
      escrowTokenAccount: escrowTokenAccount.toBase58(),
      buyer: wallet.publicKey.toBase58(),
      seller: sellerPublicKey.toBase58(),
      mint: CBDC_MINT.toBase58(),
      buyerTokenAccount: buyerTokenAccount.toBase58(),
      tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
      systemProgram: SystemProgram.programId.toBase58(),
      rent: SYSVAR_RENT_PUBKEY.toBase58(),
    })
    .transaction();
};

export const releaseFundsTransaction = async (
  wallet: any,
  sellerPublicKey: PublicKey,
  orderId: string
) => {
  if (!CBDC_MINT) throw new Error("CBDC Mint not configured");
  
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  const program = new Program(IDL, provider);

  const [escrowAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("escrow"),
      wallet.publicKey.toBuffer(),
      sellerPublicKey.toBuffer(),
      Buffer.from(orderId),
    ],
    PROGRAM_ID
  );

  const [escrowTokenAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("token"),
      escrowAccount.toBuffer()
    ],
    PROGRAM_ID
  );

  const sellerTokenAccount = await getAssociatedTokenAddress(CBDC_MINT, sellerPublicKey);

  return await program.methods
    .releaseFunds()
    .accounts({
      escrowAccount: escrowAccount.toBase58(),
      escrowTokenAccount: escrowTokenAccount.toBase58(),
      sellerTokenAccount: sellerTokenAccount.toBase58(),
      buyer: wallet.publicKey.toBase58(),
      tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
    })
    .transaction();
};

