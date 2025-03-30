// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pins/pinsSlice';
import categoryReducer from './categories/categoriesSlice';
import modalReducer from './toggleModals/toggleModalSlice';
import locationReducer from './location/locationSlice'; // Ensure this import is correct
import listReducer from './List/listSlice'; // Import the listReducer
import activePinModalReducer from './activePinModal/activePinModalSlice'; // Import the activePinModalReducer

const store = configureStore({
  reducer: {
    pins: pinReducer,
    categories: categoryReducer,
    modals: modalReducer,
    location: locationReducer,
    selectedList: listReducer, 
    activePinModal: activePinModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;