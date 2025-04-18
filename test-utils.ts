import { configureStore } from "@reduxjs/toolkit";
import modalsReducer from "./src/app/store/toggleModals/toggleModalSlice";

export const createTestStore = (preloadedModalsState = {}) => {
  return configureStore({
    reducer: {
      modals: modalsReducer,
    },
    // Redux Toolkit includes thunk by default, so no need to add it
    // If you need to customize middleware, use this approach:
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    preloadedState: {
      modals: {
        editModal: false,
        addModal: true,
        imageModal: false,
        fullScreen: false,
        ListScreen: false,
        categoryModal: false,
        ...preloadedModalsState,
      },
    },
  });
};