import {useEffect, useState} from 'react';
import onboard from './WebOnboard';
import { ethers } from 'ethers';
import usdtAbi from "./useABI.json";
import {connectWallet} from "../common/common.js";

const ConnectWallet = () => {
  const [provider, setProvider] = useState(null);
  // 在组件加载时设置语言和重连钱包
  useEffect(() => {
    onboard.state.actions.setLocale('zh')
    const restoreWallet = async () => {
      const previouslyConnectedWallets = JSON.parse(
          window.localStorage.getItem('onboard.js:last_connected_wallet') || '[]'
      );
      if (previouslyConnectedWallets.length > 0) {
        const wallets = await onboard.connectWallet({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true, // 禁用弹窗
          },
        });
        const ethersProvider = new ethers.providers.Web3Provider(
            wallets[0].provider,
            'any',
        );
        console.log('connected wallets: ', wallets);
        setProvider(ethersProvider);
        wallets[0].provider.on('disconnect', handleDisconnect);
      }
    };
    restoreWallet();
  }, []);

  // 连接钱包
   const connect = async () => {
      var wallets,ethersProvider = connectWallet();
      setProvider(ethersProvider);
      // 设置事件监听器
     wallets[0].provider.on('disconnect', handleDisconnect);
  };

  // 处理主动断开连接事件
  const handleDisconnect = () => {
    setProvider(null);
    console.log('钱包主动断开连接');
  };
  
  const sendUSDTTransaction = async (amount) => {
    if (!provider) {
        alert("请先连接钱包");
        return;
    }  

    try {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      console.log(network)
      // switch (network) {
      //   case
      // }
      const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT 智能合约地址
      const usdtContract = new ethers.Contract(
        usdtContractAddress,
        usdtAbi,
        signer
      );

      const amountInWei = ethers.utils.parseUnits(amount.toString(), 6); // 转换金额格式到 USDT 小数点位
      const tx = await usdtContract.transfer("0x1510472bB6718ca4fb62FA3Bbe9072978EEfd0da", amountInWei);
      const receipt = await tx.wait();
      alert(`转账成功！Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      alert(`转账失败: ${error.message}`);
    }
  };
  
  return (
    <div>
      {!localStorage.getItem("token") || !localStorage.getItem("onboard.js:last_connected_wallet") ? (
        <button onClick={connect}>连接钱包</button>
      ) : (
        <div>
          {/*<p>钱包信息: {wallet.accounts[0].address}</p>*/}
          <button onClick={()=>sendUSDTTransaction(0.001)}>充值</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
