import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PinState {
  editModal: boolean;
  addModal: boolean;
  imageModal: boolean;
}

const initialState: PinState = {
  editModal: false,
  addModal: false,
  imageModal: false,
};

const pinsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    toggleAddModal: (state, action: PayloadAction<boolean>) => {
      state.addModal = action.payload;
    },
    toggleEditModal: (state, action: PayloadAction<boolean>) => {
      state.addModal = action.payload;
    },
    toggleImageModal: (state, action: PayloadAction<boolean>) => {
      state.addModal = action.payload;
    },
  },
});

export const { toggleAddModal } = pinsSlice.actions;

export const selectAddModal = (state: { modals: PinState }) => state.modals.addModal;
export const selectEditModal = (state: { modals: PinState }) => state.modals.editModal;
export const selectImageModal = (state: { modals: PinState }) => state.modals.imageModal;

export default pinsSlice.reducer;