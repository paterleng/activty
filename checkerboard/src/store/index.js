import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';

const store = configureStore({
  reducer: {
    wallet: walletReducer, // 注册钱包 slice
  },
});

export default store;
