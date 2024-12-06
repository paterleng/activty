// src/web3Onboard.js
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: 1,
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://sepolia.infura.io/v3/512c7938c0084f22bc5369a77c5222ef',
    },
    {
      id: 11155111, 
      token: 'SEP-ETH',
      label: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/512c7938c0084f22bc5369a77c5222ef', // 替换 ${INFURA_ID} 为实际 Infura 项目的 ID
    },
  ],
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: 'Connect your wallet',
          description: 'Connecting your wallet is like logging into Web3. Select your wallet to get started.',
          noWalletsFound: 'I don’t have a wallet',
          whyNotSeeWallet: 'Why don’t I see my wallet?',
          clickHere: 'Click here to learn more'
        }
      }
    },
    zh: {
      connect: {
        selectingWallet: {
          header: '连接您的钱包',
          description: '123',
          noWalletsFound: '我没有钱包',
          whyNotSeeWallet: '为什么没有看到我的钱包？',
          clickHere: '点击这里了解更多'
        }
      }
    }
  }
});

export default onboard;

