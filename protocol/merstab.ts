import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey, sendAndConfirmTransaction, Signer, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
// @ts-ignore
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, AccountLayout as TokenAccountLayout, createMint, Token } from '@solana/spl-token';
// @ts-ignore
import { getMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import idl from "./idls/merstab_protocol.json";

export interface VaultMetadata {
    vault: PublicKey,
    tokenVaultPDA: PublicKey,
    tokenMint: PublicKey,
    stakedTokenMint: PublicKey,
    tokenVaultAuthPDA: PublicKey
    stakedTokenMintAuthority: PublicKey
}

/**
 * Wallet interface for objects that can be used to sign provider transactions.
 */
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}

const PubKeysInternedMap = new Map<string, PublicKey>();
export const toPublicKey = (key: string | PublicKey) => {
    if (typeof key !== 'string') {
        return key;
    }

    let result = PubKeysInternedMap.get(key);
    if (!result) {
        result = new PublicKey(key);
        PubKeysInternedMap.set(key, result);
    }

    return result;
};

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export async function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): Promise<PublicKey> {
    return (await PublicKey.findProgramAddress(
        [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    ))[0];
}

/**
 * Convert some object of fields with address-like values,
 * such that the values are converted to their `PublicKey` form.
 * @param obj The object to convert
 */
export function toPublicKeys(
    obj: Record<string, string | PublicKey | any>
): any {
    const newObj: any = {};

    for (const key in obj) {
        if (key == "name") continue;
        const value = obj[key];

        if (typeof value == "string") {
            newObj[key] = new PublicKey(value);
        } else if (typeof value == "object" && "publicKey" in value) {
            newObj[key] = value.publicKey;
        } else {
            newObj[key] = value;
        }
    }

    return newObj;
}



export async function getOrInitTokenAccounts(
    merstabClient: MerstabClient,
    vaultMetadata: VaultMetadata,
    walletPubKey: PublicKey,
) {
    // calculate ATA
    let ata = await getAssociatedTokenAddress(
        vaultMetadata.tokenMint, // mint
        walletPubKey // owner
    );
    console.log(`ATA: ${ata.toBase58()}`);

    // create account if doesn't exist -- testing
    const tokenAccountData = await merstabClient.program.provider.connection.getAccountInfo(ata)
    if (!tokenAccountData) {
        let tx = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
                TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                vaultMetadata.stakedTokenMint, // mint
                ata, // ata
                walletPubKey, // owner of token account
                walletPubKey // fee payer
            )
        );
        try {
            // const txId = await merstabClient.program.provider.send(tx)
            // console.log(`txhash- create account: ${txId}`);

        } catch (err) {
            console.log(err)
        }
    }

    let stakedATA = await getAssociatedTokenAddress(
        vaultMetadata.stakedTokenMint, // mint
        walletPubKey // owner
    );
    console.log(`Staked ATA: ${stakedATA.toBase58()}`);

    const stakedAccountData = await merstabClient.program.provider.connection.getAccountInfo(stakedATA)
    if (!stakedAccountData) {
        let tx = new Transaction();
        const ix = createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            vaultMetadata.stakedTokenMint, // mint
            stakedATA, // ata
            walletPubKey, // owner of token account
            walletPubKey // fee payer
        )
        tx.add(ix);
        try {
            // const txId = await merstabClient?.program?.provider?.send(tx)
            // console.log(`txhash- create account: ${txId}`);

        } catch (err) {
            console.log(err)
        }
    }
    return { ata, stakedATA };
}


export class MerstabClient {
    constructor(public program: anchor.Program, public network: string, public vaultMetadata: VaultMetadata) { }

    static async connect(provider: anchor.AnchorProvider, network: string): Promise<MerstabClient> {
        const program = new anchor.Program(idl as any, MerstabClient.MERSTAB_ID, provider);
        const vaultMetdata = toPublicKeys(idl.metadata) as VaultMetadata;

        return new MerstabClient(program, network, vaultMetdata);
    }
    static MERSTAB_ID = new PublicKey("AQPDVpAsDtd8cfXVjrUEKrhchF4cYwST2wyq3tJa82ci");
    static MANGO_OWNER_PDA_SEED = 'mango_owner_pda_seed';
    static STAKED_TOKENS_PDA_SEED = 'staked_token_mint_authority';
    static VAULT_SEED = 'vault-seed';

    // async getVaultValue(): Promise<number> {
    //     const tokenAccountData = await this.program.provider.connection.getAccountInfo(this.vaultMetadata.tokenVaultPDA);
    //     const parsedStakedTokenAccountData = TokenAccountLayout.decode(tokenAccountData?.data);
    //     return new anchor.BN(parsedStakedTokenAccountData.amount, undefined, "le").toNumber();
    // }

    // async getTokenAccount(walletPubKey: PublicKey) {
    //     return await getAssociatedTokenAddress(
    //         this.vaultMetadata.tokenMint,
    //         walletPubKey
    //     );
    // }

    // async getStakedTokenAccount(walletPubKey: PublicKey) {
    //     return await getAssociatedTokenAddress(
    //         this.vaultMetadata.stakedTokenMint,
    //         walletPubKey
    //     );
    // }

    // node helper function
    async addVault(vaultName: string, wallet: Keypair) {
        const vault = Keypair.generate();
        console.log(`New vault public key ${vault.publicKey.toString()}`);

        const [mangoOwnerPDA, mangoOwnerBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.MANGO_OWNER_PDA_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName)),
            ],
            this.program.programId
        );

        const [tokenAccountPDA, tokenAccountBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.VAULT_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName))
            ],
            this.program.programId
        );

        const stakedMint = await createMint(
            this.program.provider.connection,
            wallet,
            wallet.publicKey,
            wallet.publicKey,
            6,
            anchor.web3.Keypair.generate(),
            null,
            TOKEN_PROGRAM_ID
        );
        console.log(`Staked token mint: ${stakedMint.toString()}`);

        // generated by me
        const quoteMint = new PublicKey("BNH9xMad6Gh3qxGPbkwKE221gepfuUPMGs9XLGpVeBmv");

        this.program.methods
            .addVault(vaultName, mangoOwnerBump)
            .accounts({
                vault: vault.publicKey,
                manager: wallet.publicKey,
                tokenAccount: tokenAccountPDA,
                tokenAccountAuthority: mangoOwnerPDA,
                stakedTokenMint: stakedMint,
                payer: wallet.publicKey,
                mint: quoteMint,
                rent: SYSVAR_RENT_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .signers([vault, wallet])
            .rpc()

    }

    async stake(amount: anchor.BN, wallet: PublicKey, keypair?: Keypair) {
        // get these values from add vault
        const vault = new PublicKey("5Fczud8oRx8f9yQhMcvW9EpehEpRyai5MBJieEgbTjfD");
        const vaultName = "another";
        const merstabUSDCMint = new PublicKey("Hh4cZG3Wb7ZsR6gCLzVrCDsLkUmQkc132xTs4EN75moy");
        const mUSDCMint = await getMint(this.program.provider.connection, merstabUSDCMint, null, TOKEN_PROGRAM_ID);

        const mUSDCStakerAccount = await getAssociatedTokenAddress(merstabUSDCMint, wallet);

        const ataIx = createAssociatedTokenAccountInstruction(
            wallet,
            mUSDCStakerAccount,
            wallet,
            merstabUSDCMint,
        )

        // should be 22VpUEiJp7nXw3us2Eczz1R2xhdFaACT5xTcDWLEiZxv
        const walletUSDCAccount = await getAssociatedTokenAddress(new PublicKey("BNH9xMad6Gh3qxGPbkwKE221gepfuUPMGs9XLGpVeBmv"), wallet);

        const [tokenAccountPDA, tokenAccountBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.VAULT_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName))
            ],
            this.program.programId
        );

        const [stakedTokenMintPDA, stakedTokenMintBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.STAKED_TOKENS_PDA_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName)),
            ],
            this.program.programId
        );
        try {
            const ix = await this.program.methods
                .stake(amount, tokenAccountBump, stakedTokenMintBump)
                .accounts({
                    vault: vault,
                    vaultTokenAccount: tokenAccountPDA, // vault USDC
                    stakersTokenAccount: walletUSDCAccount, // user USDC
                    stakersAta: mUSDCStakerAccount, // user merUSDC
                    stakedTokenMintAuthority: stakedTokenMintPDA, // should be same as mUSDCMint.mintAuthority
                    staker: wallet,
                    stakedTokenMint: merstabUSDCMint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .instruction();

            const tx = new Transaction().add(ataIx);
            tx.add(ix);
            console.log(keypair);
            const txId = await sendAndConfirmTransaction(this.program.provider.connection, tx, [keypair as anchor.web3.Signer]);
            console.log(`txhash- create account: ${txId}`);
            return txId;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async unstake(amount: anchor.BN, wallet: PublicKey, keypair?: Keypair) {
        // get these values from add vault
        const vault = new PublicKey("5Fczud8oRx8f9yQhMcvW9EpehEpRyai5MBJieEgbTjfD");
        const vaultName = "another";
        const merstabUSDCMint = new PublicKey("Hh4cZG3Wb7ZsR6gCLzVrCDsLkUmQkc132xTs4EN75moy");
        const mUSDCMint = await getMint(this.program.provider.connection, merstabUSDCMint, null, TOKEN_PROGRAM_ID);
        const mUSDCStakerAccount = await getAssociatedTokenAddress(merstabUSDCMint, wallet);

        // should be 22VpUEiJp7nXw3us2Eczz1R2xhdFaACT5xTcDWLEiZxv
        const walletUSDCAccount = await getAssociatedTokenAddress(new PublicKey("BNH9xMad6Gh3qxGPbkwKE221gepfuUPMGs9XLGpVeBmv"), wallet);

        const [mangoOwnerPDA, mangoOwnerBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.MANGO_OWNER_PDA_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName)),
            ],
            this.program.programId
        );
        const [tokenAccountPDA, tokenAccountBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.VAULT_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName))
            ],
            this.program.programId
        );
        const [stakedTokenMintPDA, stakedTokenMintBump] = await PublicKey.findProgramAddress(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode(MerstabClient.STAKED_TOKENS_PDA_SEED)),
                Buffer.from(anchor.utils.bytes.utf8.encode(vaultName)),
            ],
            this.program.programId
        );

        try {
            const ix = await this.program.methods
                .unstake(new anchor.BN(amount), mangoOwnerBump)
                .accounts({
                    vault: vault,
                    vaultTokenAccount: tokenAccountPDA,
                    vaultTokenAuthority: mangoOwnerPDA,
                    stakersTokenAccount: walletUSDCAccount,
                    stakersAta: mUSDCStakerAccount,
                    stakedTokenMintAuthority: stakedTokenMintPDA,
                    staker: wallet,
                    stakedTokenMint: merstabUSDCMint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .instruction()
            const tx = new Transaction().add(ix);
            // should send via useWallet hook
            const signers = keypair ? [keypair as Signer] : []
            const txId = await sendAndConfirmTransaction(this.program.provider.connection, tx, signers, {skipPreflight: true});
            console.log(`txhash- create account: ${txId}`);
            return txId;
        } catch (err) {
            console.log(err)
        }
    }
}