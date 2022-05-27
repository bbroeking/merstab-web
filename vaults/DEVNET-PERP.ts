import { PublicKey } from "@solana/web3.js";

export const depositMint = new PublicKey("BNH9xMad6Gh3qxGPbkwKE221gepfuUPMGs9XLGpVeBmv");
export const depositMintDecimals = 9;
export const mTokenMint = new PublicKey("Hh4cZG3Wb7ZsR6gCLzVrCDsLkUmQkc132xTs4EN75moy");    
export const vault = "5Fczud8oRx8f9yQhMcvW9EpehEpRyai5MBJieEgbTjfD";
export const vaultName = "another";

export class DevnetPerp {
    static get depositMint() {
        return depositMint;
    }

    static get mTokenMint() {
        return mTokenMint;
    }
    
    static get vault() {
        return vault;
    }
    
    static get vaultName() {
        return vaultName;
    }
}
