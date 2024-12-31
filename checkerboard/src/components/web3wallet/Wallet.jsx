import {useEffect} from 'react';
import onboard from './WebOnboard';
import {Connection, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {loginUser, ReCharge} from "../../apis/manage.js";
import {useDispatch, useSelector} from "react-redux";
import {setToken} from "../../store/store.js";
import './Wallet.css'
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  // 在组件加载时设置语言
  useEffect(() => {
    onboard.state.actions.setLocale('zh')
  }, [token]);

  // 连接钱包
  const connect = async () => {
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
           localStorage.setItem("token",response.data);
           dispatch(setToken(response.data));
         }
       }
    // 连接成功后设置监听事件
    // wallets[0].provider.on('disconnect', handleDisconnect());
  };


  // 处理主动断开连接事件
  // const handleDisconnect = () => {
  //   dispatch(setToken(null));
  //   console.log('钱包主动断开连接');
  // };

// 动态设置 provider
  let currentProvider = null;
  function setProvider(provider) {
    currentProvider = provider;
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
          await connect()
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

  return (
  <>
    {!localStorage.getItem("token") ? (
        <button className="wallet-button" onClick={connect}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15 13V13.8333C15 14.75 14.25 15.5 13.3333 15.5H1.66667C0.741667 15.5 0 14.75 0 13.8333V2.16667C0 1.25 0.741667 0.5 1.66667 0.5H13.3333C14.25 0.5 15 1.25 15 2.16667V3H7.5C6.575 3 5.83333 3.75 5.83333 4.66667V11.3333C5.83333 12.25 6.575 13 7.5 13H15ZM7.5 11.3333H15.8333V4.66667H7.5V11.3333ZM10.8333 9.25C10.1417 9.25 9.58333 8.69167 9.58333 8C9.58333 7.30833 10.1417 6.75 10.8333 6.75C11.525 6.75 12.0833 7.30833 12.0833 8C12.0833 8.69167 11.525 9.25 10.8333 9.25Z"
                fill="white"/>
          </svg>
          <span style={{marginLeft:'10rem'}}>Connect Wallet</span>
        </button>
    ) : (
        <div>
          <button className='wallet-button' onClick={() => sendTransaction("Y7oMKu2H2iidZVUGGmMpzWLmeRJ4KBXngr6THrL9AqS", 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M15 13V13.8333C15 14.75 14.25 15.5 13.3333 15.5H1.66667C0.741667 15.5 0 14.75 0 13.8333V2.16667C0 1.25 0.741667 0.5 1.66667 0.5H13.3333C14.25 0.5 15 1.25 15 2.16667V3H7.5C6.575 3 5.83333 3.75 5.83333 4.66667V11.3333C5.83333 12.25 6.575 13 7.5 13H15ZM7.5 11.3333H15.8333V4.66667H7.5V11.3333ZM10.8333 9.25C10.1417 9.25 9.58333 8.69167 9.58333 8C9.58333 7.30833 10.1417 6.75 10.8333 6.75C11.525 6.75 12.0833 7.30833 12.0833 8C12.0833 8.69167 11.525 9.25 10.8333 9.25Z"
                  fill="white"/>
            </svg>
            <span style={{marginLeft:'10rem'}}>充值</span>
          </button>
        </div>
    )}
  </>
  )
      ;
};

export default ConnectWallet;
