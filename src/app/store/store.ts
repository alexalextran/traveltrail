// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pins/pinsSlice';
import categoryReducer from './categories/categoriesSlice';
import modalReducer from './toggleModals/toggleModalSlice';
import locationReducer from './location/locationSlice'; // Ensure this import is correct

const store = configureStore({
  reducer: {
    pins: pinReducer,
    categories: categoryReducer,
    modals: modalReducer,
    location: locationReducer, // Use locationReducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;