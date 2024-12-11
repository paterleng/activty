import {useEffect, useState} from 'react';
// import { setProvider,clearProvider } from '../../store/wallet';
import onboard from './WebOnboard';
import {loginUser} from '../../apis/manage'
import { ethers } from 'ethers';
import usdtAbi from "./useABI.json"; // 引入 USDT 的 ABI

const ConnectWallet = () => {
  const [provider, setProvider] = useState(null);

  // 在组件加载时设置语言
  useEffect(() => {
    onboard.state.actions.setLocale('zh')
    const currentState = onboard.state.get()
    console.log(currentState);
  }, []);

  // 连接钱包
  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
      setProvider(wallets[0].provider);
      localStorage.setItem("walletAddress", wallets[0].accounts[0].address);
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
      const currentState = onboard.state.get()
      console.log(currentState);

      console.log(ethersProvider);
      // 设置事件监听器
      wallets[0].provider.on('disconnect', handleDisconnect);
    }
  };

  // 处理主动断开连接事件
  const handleDisconnect = () => {
    console.log('钱包主动断开连接');
  };

  // // 处理账户切换事件
  // const handleAccountsChanged = (accounts) => {
  //   if (accounts.length === 0) {
  //     console.log('钱包账户已断开');
  //     handleDisconnect();
  //   } else {
  //     console.log('钱包账户切换至:', accounts[0]);
  //     setWallet((prevWallet) => ({
  //       ...prevWallet,
  //       accounts: [{ address: accounts[0] }],
  //     }));
  //   }
  // };
  
  const sendUSDTTransaction = async (amount) => {
    if (!provider) {
        alert("请先连接钱包");
        return;
    }  

    try {
      const signer = provider.getSigner();
      // 检测链信息
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
      alert("转账交易发送中...");
      const receipt = await tx.wait();
      alert(`转账成功！Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      alert(`转账失败: ${error.message}`);
    }
  };
  
  return (
    <div>
      {!localStorage.getItem("token") || !provider ? (
        <button onClick={connectWallet}>连接钱包</button>
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
