import { useState } from 'react';
import onboard from './WebOnboard';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);

  // 连接钱包
  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
      setWallet(wallets[0]);

      console.log("账户信息：", wallets);

      const ethersProvider = new ethers.providers.Web3Provider(
        wallets[0].provider,
        'any',
      );

      setProvider(ethersProvider);

      // 设置事件监听器
      wallets[0].provider.on('disconnect', handleDisconnect);
      wallets[0].provider.on('accountsChanged', handleAccountsChanged);
    }
  };

  // 断开钱包
  const disconnectWallet = async () => {
    if (wallet) {
      wallet.provider.removeListener('disconnect', handleDisconnect);
      wallet.provider.removeListener('accountsChanged', handleAccountsChanged);

      await onboard.disconnectWallet({ label: wallet.label });
      setWallet(null);
      setProvider(null);
    }
  };

  // 处理主动断开连接事件
  const handleDisconnect = () => {
    console.log('钱包主动断开连接');
    setWallet(null);
    setProvider(null);
  };

  // 处理账户切换事件
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log('钱包账户已断开');
      handleDisconnect();
    } else {
      console.log('钱包账户切换至:', accounts[0]);
      setWallet((prevWallet) => ({
        ...prevWallet,
        accounts: [{ address: accounts[0] }],
      }));
    }
  };


  // 发起交易
  const sendTransaction = async () => {
    if (!provider) {
      alert('请先连接钱包！');
      return;
    }

    try {
      const signer = provider.getSigner(); 
      const tx = await signer.sendTransaction({
        to: '0x1510472bB6718ca4fb62FA3Bbe9072978EEfd0da', 
        value: ethers.utils.parseEther('0.0001'), 
      });
      console.log(tx)

      provider.once(tx.hash, (receipt) => {
        // 在交易成功的时候，增加用户金额
      console.log('Transaction confirmed via listener:', receipt);
      alert(`交易已确认，交易哈希: ${tx.hash}`);
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    alert(`交易失败: ${error.message}`);
  }
  };

  return (
    <div>
      {!wallet ? (
        <button onClick={connectWallet}>连接钱包</button>
      ) : (
        <div>
          <p>钱包信息: {wallet.accounts[0].address}</p>
          <button onClick={disconnectWallet}>断开连接</button>
          <button onClick={sendTransaction}>创建交易</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
