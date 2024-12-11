import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    provider: null,  // 用来存储 provider
  },
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    clearProvider: (state) => {
      state.provider = null;
    },
  },
});

export const { setProvider, clearProvider } = walletSlice.actions;

export default walletSlice.reducer;
