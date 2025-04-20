// test-utils.ts
import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './src/app/store/pins/pinsSlice';
import categoryReducer from './src/app/store/categories/categoriesSlice';
import modalReducer from './src/app/store/toggleModals/toggleModalSlice';
import locationReducer from './src/app/store/location/locationSlice';
import listReducer from './src/app/store/List/listSlice';
import activePinModalReducer from './src/app/store/activePinModal/activePinModalSlice';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      pins: pinReducer,
      categories: categoryReducer,
      modals: modalReducer,  // Changed from modalsReducer to modalReducer to match main store
      location: locationReducer,
      selectedList: listReducer,
      activePinModal: activePinModalReducer,
    },
    preloadedState,
  });
};