import { PublicKey } from "@solana/web3.js";

// NOTE THIS EXAMPLE'S LIMIT IS TOO LOW TO WORK 
export const depositMint = new PublicKey("BNH9xMad6Gh3qxGPbkwKE221gepfuUPMGs9XLGpVeBmv");
export const depositMintDecimals = 9;
export const mTokenMint = new PublicKey("GmtrLLe3p8zNfdQgtjcJUYAWKoYoVuh9swPjAfiBAB1A");    
export const vault = new PublicKey("56gmTG16aiLocahaREBnkTJypTfJEmSxzvzy5eF46jWM");

export class DevnetPerp {
    static get depositMint() {
        return depositMint;
    }

    static get depositMintDecimals() {
        return depositMintDecimals;
    }

    static get mTokenMint() {
        return mTokenMint;
    }
    
    static get vault() {
        return vault;
    }
    
    static get vaultName() {
        return "TBD";
        // return vaultName;
    }
}
