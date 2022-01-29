import * as anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

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

export async function getAndInitTokenAccounts(
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

    // create account if doesn't exist
    if (!merstabClient.program.provider.connection.getAccountInfo(ata)) {
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

        } catch(err) {
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

    if (!merstabClient.program.provider.connection.getAccountInfo(stakedATA)) {

        let tx = new Transaction().add(
            Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
                TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                vaultMetadata.stakedTokenMint, // mint
                stakedATA, // ata
                walletPubKey, // owner of token account
                walletPubKey // fee payer
            )
        );
        try {
            const txId = await merstabClient.program.provider.send(tx)
            console.log(`txhash- create account: ${txId}`);

        } catch(err) {
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

    async stake(
        amount: anchor.BN,
        wallet: PublicKey,
        gatewayToken: PublicKey,
        gatekeeperNetwork: PublicKey,
    ) {
        const { ata, stakedATA } = await getAndInitTokenAccounts(this, this.vaultMetadata, wallet);
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

                userWallet: wallet,
                gatewayToken,
                gatekeeperNetwork
            },
        });

        const tx = new Transaction().add(ix);
        try {
            const txId = await this.program.provider.send(tx)
            console.log(`txhash- create account: ${txId}`);

        } catch(err) {
            console.log(err)
        }
    }

    async unstake(amount: anchor.BN, wallet: PublicKey) {
        const tokenAccount = new PublicKey('E4rbzKVZo9pM2A8rNoAYrvwYYq6c8z35WWN5bsCkER85');//await findAssociatedTokenAddress(wallet, this.vaultMetadata.tokenMint)
        const stakedTokenAccount = new PublicKey('Ao42CKHYZG7P7811NW28vrCeAixuzEoTSWyYMzKmWZdR'); //await findAssociatedTokenAddress(wallet, this.vaultMetadata.stakedTokenMint);

        const unstakeTx = await this.program.rpc.unstake(amount, {
            accounts: {
                vault: this.vaultMetadata.vault,
                tokenVault: this.vaultMetadata.tokenVaultPDA,
                tokenVaultAuthority: this.vaultMetadata.tokenVaultAuthPDA,
                stakersTokenAccount: tokenAccount,
                stakersAta: stakedTokenAccount,
                stakedTokenMintAuthority: this.vaultMetadata.stakedTokenMintAuthority,
                staker: wallet,
                stakedTokenMint: this.vaultMetadata.stakedTokenMint,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
        })
        console.log(`TxId: ${unstakeTx}`);
    }
}