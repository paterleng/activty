import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: null, // 钱包信息
    provider: null, // ethers.js 的 provider 实例
  },
  reducers: {
    setWallet(state, action) {
      state.wallet = action.payload;
    },
    setProvider(state, action) {
      state.provider = action.payload;
    },
    clearWallet(state) {
      state.wallet = null;
      state.provider = null;
    },
  },
});

export const { setWallet, setProvider, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
