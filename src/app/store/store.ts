// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pins/pinsSlice';
import categoryReducer from './categories/categoriesSlice';

const store = configureStore({
  reducer: {
    pins: pinReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;