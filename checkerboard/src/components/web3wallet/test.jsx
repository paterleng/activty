
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import * as web3 from "@solana/web3.js";
import {GlowWalletAdapter} from "@solana/wallet-adapter-glow";
import {BackpackWalletAdapter} from "@solana/wallet-adapter-backpack";



const Home = () => {
    const endpoint = web3.clusterApiUrl("devnet");
    const wallets = [
        new PhantomWalletAdapter(),
        new GlowWalletAdapter(),
        new BackpackWalletAdapter()
    ];


    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    123
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Home;