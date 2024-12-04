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
});

export default onboard;

