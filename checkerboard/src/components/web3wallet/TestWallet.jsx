import  { useState } from "react";
import { ethers } from "ethers";
import usdtAbi from "./useABI.json"; // 引入 USDT 的 ABI

const USDTTransactionComponent = () => {
  const [provider, setEthersProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const _signer = _provider.getSigner();
        setEthersProvider(_provider);
        setSigner(_signer);
      } catch (error) {
        console.error("钱包连接失败", error);
      }
    } else {
      alert("请安装 MetaMask");
    }
  };

  const sendUSDTTransaction = async (recipientAddress, amount) => {
    try {
      if (!signer) {
        alert("请先连接钱包");
        return;
      }

      const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT 智能合约地址
      const usdtContract = new ethers.Contract(
        usdtContractAddress,
        usdtAbi,
        signer
      );

      const amountInWei = ethers.utils.parseUnits(amount.toString(), 6); // 转换金额格式到 USDT 小数点位

      const tx = await usdtContract.transfer(recipientAddress, amountInWei);
      alert("转账交易发送中...");
      const receipt = await tx.wait();
      alert(`转账成功！Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("USDT 转账失败", error);
      alert(`转账失败: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>USDT 转账组件</h2>
      {!provider ? (
        <button onClick={connectWallet}>连接钱包</button>
      ) : (
        <>
          <button
            onClick={() =>
              sendUSDTTransaction(
                "0x1510472bB6718ca4fb62FA3Bbe9072978EEfd0da",
                10
              )
            }
          >
            发送 10 USDT
          </button>
        </>
      )}
    </div>
  );
};

export default USDTTransactionComponent;
