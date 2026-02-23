import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLang: localStorage.getItem('lang') || 'en',
  },
  reducers: {
    setLanguages: (state, action) => {
      state.currentLang = action.payload;
    },
  },
});

export const { setLanguages } = languageSlice.actions;
export default languageSlice.reducer;