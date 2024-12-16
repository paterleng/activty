import {useEffect} from 'react';
import onboard from './WebOnboard';
import {connectWallet} from "../common/common.js";
import {Connection, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {ReCharge} from "../../apis/manage.js";

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');



const ConnectWallet = () => {
  // 在组件加载时设置语言
  useEffect(() => {
    onboard.state.actions.setLocale('zh')
  }, []);

  // 连接钱包
   const connect = async () => {
     var wallets = connectWallet();
     console.log(wallets)
  };

// 动态设置 provider
  let currentProvider = null;

  function setProvider(provider) {
    currentProvider = provider;
    console.log("钱包已设置为: ", provider);
  }

  async function sendTransaction(recipientAddress, amount) {
    try {
      if (!window.solana) {
        console.error("Solana 钱包未检测到");
        return;
      }
      if (!window.solana.isPhantom && !window.backpack) {
        console.error("不支持的 Solana 钱包");
        return;
      }
      const wallet = JSON.parse(localStorage.getItem("onboard.js:last_connected_wallet"));
      switch (wallet?.[0]) {
        case "Backpack":
          if (window.backpack?.solana) {
            setProvider(window.backpack.solana);
          } else {
            console.error("Backpack 钱包未准备好");
            return;
          }
          break;
        case "Phantom":
          if (window.phantom?.solana) {
            setProvider(window.phantom.solana);
          } else {
            console.error("Phantom 钱包未准备好");
            return;
          }
          break;
        default:
          console.error("当前钱包类型不受支持");
          return;
      }
      if (!currentProvider) {
        console.error("当前 provider 未设置");
        return;
      }
      // 确保连接钱包
      if (!currentProvider.isConnected) {
        await currentProvider.connect();
      }

      const senderPublicKey = currentProvider.publicKey;
      const recipientPublicKey = new PublicKey(recipientAddress);
      const lamports = amount * 1e9; // 转换为 lamports

      const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: senderPublicKey,
            toPubkey: recipientPublicKey,
            lamports,
          })
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = senderPublicKey;

      // 签名
      const signedTransaction = await currentProvider.signTransaction(transaction);
      // 创建交易
      const txId = await connection.sendRawTransaction(signedTransaction.serialize());
      // 检测交易是否成功
      await connection.confirmTransaction(txId, 'confirmed');
      console.log("交易已确认，交易 ID：", txId);
      const data = {
        "transaction_hash": txId,
      }
      await ReCharge(data)
    } catch (error) {
      console.error("交易失败:", error);
    }
  }

  // 处理主动断开连接事件
  // const handleDisconnect = () => {
  //   setProvider(null);
  //   console.log('钱包主动断开连接');
  // };

  return (
    <div>
      {/*使用token控制展示不展示*/}
      {!localStorage.getItem("token") ? (
          <button onClick={connect}>连接钱包</button>
        ) : (
        <div>
          <button onClick={()=>sendTransaction("Y7oMKu2H2iidZVUGGmMpzWLmeRJ4KBXngr6THrL9AqS",1)}>充值</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
