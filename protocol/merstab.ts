import * as anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, AccountLayout as TokenAccountLayout } from '@solana/spl-token';
const idl = require('./idls/devnet.json');

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
    let ata = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        vaultMetadata.tokenMint, // mint
        walletPubKey // owner
    );
    console.log(`ATA: ${ata.toBase58()}`);

    // create account if doesn't exist -- testing
    const tokenAccountData = await merstabClient.program.provider.connection.getAccountInfo(ata)
    if (!tokenAccountData) {
        let tx = new Transaction().add(
            Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
                TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                vaultMetadata.stakedTokenMint, // mint
                ata, // ata
                walletPubKey, // owner of token account
                walletPubKey // fee payer
            )
        );
        try {
            const txId = await merstabClient.program.provider.send(tx)
            console.log(`txhash- create account: ${txId}`);

        } catch (err) {
            console.log(err)
        }
    }

    let stakedATA = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        vaultMetadata.stakedTokenMint, // mint
        walletPubKey // owner
    );
    console.log(`Staked ATA: ${stakedATA.toBase58()}`);

    const stakedAccountData = await merstabClient.program.provider.connection.getAccountInfo(stakedATA)
    if (!stakedAccountData) {
        let tx = new Transaction();
        const ix = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            vaultMetadata.stakedTokenMint, // mint
            stakedATA, // ata
            walletPubKey, // owner of token account
            walletPubKey // fee payer
        )
        tx.add(ix);
        try {
            const txId = await merstabClient.program.provider.send(tx)
            console.log(`txhash- create account: ${txId}`);

        } catch (err) {
            console.log(err)
        }
    }
    return { ata, stakedATA };
}

export function airdropTestToken() {
    // let tsfrTx = new Transaction();
    // let tsfrIx = await Token.createTransferInstruction(TOKEN_PROGRAM_ID, tokenAccount, ata, wallet.publicKey, [], 100);
    // tsfrTx.add(tsfrIx);
    // console.log(`txhash: ${await merstabClient.program.provider.send(tsfrTx)}`);
}

export class MerstabClient {
    constructor(public program: anchor.Program, public devnet: boolean, public vaultMetadata: VaultMetadata) { }

    static async connect(provider: anchor.Provider, devnet: boolean): Promise<MerstabClient> {
        // const network = devnet ? 'devnet' : 'mainnet-beta';
        const MERSTAB_ID = new PublicKey("37n7Fd74Mgt7V24VtfYrr5zGFKm5x9fhRNCQXjZZVCRN");
        const program = new anchor.Program(idl, MERSTAB_ID, provider);
        const vaultMetdata = toPublicKeys(idl.metadata) as VaultMetadata;

        return new MerstabClient(program, devnet, vaultMetdata);
    }

    async getVaultValue(): Promise<number> {
        const tokenAccountData = await this.program.provider.connection.getAccountInfo(this.vaultMetadata.tokenVaultPDA);
        const parsedStakedTokenAccountData = TokenAccountLayout.decode(tokenAccountData?.data);

        return new anchor.BN(parsedStakedTokenAccountData.amount, undefined, "le").toNumber();
    }

    async getTokenAccount(walletPubKey: PublicKey) {
        return await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            this.vaultMetadata.tokenMint,
            walletPubKey
        );
    }

    async getStakedTokenAccount(walletPubKey: PublicKey) {
        return await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            this.vaultMetadata.stakedTokenMint,
            walletPubKey
        );
    }

    async stake(
        amount: anchor.BN,
        wallet: PublicKey,
        // gatewayToken: PublicKey,
        // gatekeeperNetwork: PublicKey,
    ) {
        try {

            const { ata, stakedATA } = await getOrInitTokenAccounts(this, this.vaultMetadata, wallet);
            const ix = await this.program.instruction.stake(amount, {
                accounts: {
                    vault: this.vaultMetadata.vault,
                    tokenVault: this.vaultMetadata.tokenVaultPDA,
                    stakersTokenAccount: ata,
                    stakersAta: stakedATA,
                    stakedTokenMintAuthority: this.vaultMetadata.stakedTokenMintAuthority,
                    staker: wallet,
                    stakedTokenMint: this.vaultMetadata.stakedTokenMint,
                    tokenProgram: TOKEN_PROGRAM_ID,

                    // userWallet: wallet,
                    // gatewayToken,
                    // gatekeeperNetwork
                },
            });

            const tx = new Transaction().add(ix);
            const txId = await this.program.provider.send(tx)
            console.log(`txhash- create account: ${txId}`);

        } catch (err) {
            console.log(err)
        }
    }

    async unstake(amount: anchor.BN, wallet: PublicKey) {
        try {
            const [token_vault_auth_pda, token_vault_auth_bump] = await PublicKey.findProgramAddress(
                [
                    Buffer.from(anchor.utils.bytes.utf8.encode("token_vault_authority")),
                    Buffer.from(anchor.utils.bytes.utf8.encode('RdtHKxfH4r'))
                ],
                this.program.programId
            );
            console.log(token_vault_auth_pda);

            const { ata, stakedATA } = await getOrInitTokenAccounts(this, this.vaultMetadata, wallet);
            const unstakeIx = await this.program.instruction.unstake(amount, {
                accounts: {
                    vault: this.vaultMetadata.vault,
                    tokenVault: this.vaultMetadata.tokenVaultPDA,
                    tokenVaultAuthority: token_vault_auth_pda,
                    stakersTokenAccount: ata,
                    stakersAta: stakedATA,
                    stakedTokenMintAuthority: this.vaultMetadata.stakedTokenMintAuthority,
                    staker: wallet,
                    stakedTokenMint: this.vaultMetadata.stakedTokenMint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
            })
            const tx = new Transaction().add(unstakeIx);
            const txId = await this.program.provider.send(tx)
            console.log(`txhash- create account: ${txId}`);

        } catch (err) {
            console.log(err)
        }
    }
}