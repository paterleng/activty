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

// 计算与当前时间差值,返回以秒为单位
export const timeValue =  (oldTime) => {// 示例：ISO 8601 格式
    const targetDate = new Date(oldTime);
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;
    const seconds = Math.floor(timeDifference / 1000);
    return seconds;
}