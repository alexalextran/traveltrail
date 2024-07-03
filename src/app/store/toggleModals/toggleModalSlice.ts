import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  editModal: boolean;
  addModal: boolean;
  imageModal: boolean;
  fullScreen: boolean;
}

const initialState: ModalState = {
  editModal: false,
  addModal: false,
  imageModal: false,
  fullScreen: false,
};

const pinsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    toggleAddModal: (state, action: PayloadAction<boolean>) => {
      state.addModal = action.payload;
    },
    toggleEditModal: (state, action: PayloadAction<boolean>) => {
      state.editModal = action.payload;
    },
    toggleImageModal: (state, action: PayloadAction<boolean>) => {
      state.imageModal = action.payload;
    },
    toggleFullScreen: (state, action: PayloadAction<boolean>) => {
      state.fullScreen = action.payload;
    },
  },
});

export const { toggleAddModal, toggleEditModal, toggleImageModal, toggleFullScreen } = pinsSlice.actions;

export const selectAddModal = (state: { modals: ModalState }) => state.modals.addModal;
export const selectEditModal = (state: { modals: ModalState }) => state.modals.editModal;
export const selectImageModal = (state: { modals: ModalState }) => state.modals.imageModal;
export const selectFullScreen = (state: { modals: ModalState }) => state.modals.fullScreen;

export default pinsSlice.reducer;