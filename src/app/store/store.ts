// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pins/pinsSlice';

const store = configureStore({
  reducer: {
    pins: pinReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
