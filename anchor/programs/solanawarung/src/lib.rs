use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Ga6pierAanLbJPV6FsxZyB8zgXhbr5spbEB5tce42EVm"); // Placeholder, will need update after first build

#[program]
pub mod solanawarung_escrow {
    use super::*;

    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        order_id: String,
        amount: u64,
    ) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        escrow_account.buyer = ctx.accounts.buyer.key();
        escrow_account.seller = ctx.accounts.seller.key();
        escrow_account.order_id = order_id;
        escrow_account.amount = amount;
        escrow_account.is_released = false;

        // Transfer tokens from buyer to escrow token account
        let cpi_accounts = Transfer {
            from: ctx.accounts.buyer_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        let amount = ctx.accounts.escrow_account.amount;
        let buyer_key = ctx.accounts.escrow_account.buyer.key();
        let seller_key = ctx.accounts.escrow_account.seller.key();
        let order_id = ctx.accounts.escrow_account.order_id.clone();
        let bump = ctx.bumps.escrow_account;

        require!(!ctx.accounts.escrow_account.is_released, EscrowError::AlreadyReleased);

        // Transfer tokens from escrow to seller
        let seeds = &[
            b"escrow",
            buyer_key.as_ref(),
            seller_key.as_ref(),
            order_id.as_bytes(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.seller_token_account.to_account_info(),
            authority: ctx.accounts.escrow_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        let escrow_account = &mut ctx.accounts.escrow_account;
        escrow_account.is_released = true;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(order_id: String, amount: u64)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = buyer,
        space = 8 + 32 + 32 + (4 + 32) + 8 + 1,
        seeds = [b"escrow", buyer.key().as_ref(), seller.key().as_ref(), order_id.as_bytes()],
        bump
    )]
    pub escrow_account: Account<'info, EscrowState>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: Seller address is validated by storing it in the escrow state
    pub seller: AccountInfo<'info>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = buyer,
        token::mint = mint,
        token::authority = escrow_account,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub mint: Account<'info, anchor_spl::token::Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow_account.buyer.as_ref(), escrow_account.seller.as_ref(), escrow_account.order_id.as_bytes()],
        bump,
        has_one = buyer,
        has_one = seller
    )]
    pub escrow_account: Account<'info, EscrowState>,
    
    pub buyer: Signer<'info>,
    
    /// CHECK: Seller address is validated by has_one
    pub seller: AccountInfo<'info>,

    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct EscrowState {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub order_id: String,
    pub amount: u64,
    pub is_released: bool,
}

#[error_code]
pub enum EscrowError {
    #[msg("Funds have already been released.")]
    AlreadyReleased,
}
