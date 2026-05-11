// @ts-nocheck
import { 
  Program, 
  AnchorProvider, 
  Idl, 
  Wallet 
} from '@coral-xyz/anchor';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY 
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress 
} from '@solana/spl-token';
import { connection, CBDC_MINT } from '../../config/solana';

// This would be imported from the build artifacts usually
const IDL = {
  "version": "0.1.0",
  "name": "solanawarung_escrow",
  "instructions": [
    {
      "name": "initializeEscrow",
      "accounts": [
        { "name": "escrowAccount", "isMut": true, "isSigner": false },
        { "name": "buyer", "isMut": true, "isSigner": true },
        { "name": "seller", "isMut": false, "isSigner": false },
        { "name": "buyerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false },
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
      "accounts": [
        { "name": "escrowAccount", "isMut": true, "isSigner": false },
        { "name": "buyer", "isMut": false, "isSigner": true },
        { "name": "seller", "isMut": false, "isSigner": false },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false },
        { "name": "sellerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "EscrowState",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "buyer", "type": "publicKey" },
          { "name": "seller", "type": "publicKey" },
          { "name": "orderId", "type": "string" },
          { "name": "amount", "type": "u64" },
          { "name": "isReleased", "type": "bool" }
        ]
      }
    }
  ]
};

const PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

export const createEscrowTransaction = async (
  wallet: any,
  sellerPublicKey: PublicKey,
  orderId: string,
  amount: number
) => {
  if (!CBDC_MINT) throw new Error("CBDC Mint not configured");
  
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  const program = new Program(IDL as Idl, PROGRAM_ID, provider);

  const [escrowAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("escrow"),
      wallet.publicKey.toBuffer(),
      sellerPublicKey.toBuffer(),
      Buffer.from(orderId),
    ],
    PROGRAM_ID
  );

  const buyerTokenAccount = await getAssociatedTokenAddress(CBDC_MINT, wallet.publicKey);
  
  // Note: Escrow Token Account is created by the program in this simplified logic
  // but in reality we might need a specific PDA or keypair.
  
  return await program.methods
    .initializeEscrow(orderId, amount)
    .accounts({
      escrowAccount,
      buyer: wallet.publicKey,
      seller: sellerPublicKey,
      buyerTokenAccount,
      // ... rest of accounts
    })
    .transaction();
};
