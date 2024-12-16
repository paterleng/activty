// src/web3Onboard.js
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import phantomModule from '@web3-onboard/phantom'
import ledgerModule from '@web3-onboard/ledger'
const phantom = phantomModule()
const injected = injectedModule();

const ledger = ledgerModule({
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: 'abc123...',
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains: [1, 137]
})

const onboard = Onboard({
  wallets: [injected,phantom,ledger],
  chains: [
    {
      id: 11155111,
      token: 'SEP-ETH',
      label: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/512c7938c0084f22bc5369a77c5222ef',
    },
  ],
  connect: {
    autoConnectLastWallet: true
  },
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

