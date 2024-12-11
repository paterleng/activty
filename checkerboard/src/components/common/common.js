import onboard from "../web3wallet/WebOnboard.js";
import {loginUser} from "../../apis/manage.js";
import {ethers} from "ethers";

export const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
        const user = {
            user_id: wallets[0].accounts[0].address,
            user_name: "",
            wallet_adr: wallets[0].accounts[0].address,
            wallet_platform: wallets[0].label
        };
        const response = await loginUser(user)
        // 存储token
        if (response.code == 200) {
            localStorage.setItem("token",response.data)
        }
        const ethersProvider = new ethers.providers.Web3Provider(
            wallets[0].provider,
            'any',
        );
        return wallets,ethersProvider;
    }
};