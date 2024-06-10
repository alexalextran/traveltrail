// src/store/pinsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pin } from '../../types/pinData';

interface PinState {
  pins: Pin[];
}

const initialState: PinState = {
  pins: [],
};

const pinsSlice = createSlice({
  name: 'pins',
  initialState,
  reducers: {
    addPin: (state, action: PayloadAction<Pin>) => {
      state.pins.push(action.payload);
    },
    updatePin: (state, action: PayloadAction<Pin>) => {
      const index = state.pins.findIndex(pin => pin.id === action.payload.id);
      if (index !== -1) {
        state.pins[index] = action.payload;
      }
    },
    deletePin: (state, action: PayloadAction<string>) => {
      state.pins = state.pins.filter(pin => pin.id !== action.payload);
    },
  },
});

export const { addPin, updatePin, deletePin } = pinsSlice.actions;
export default pinsSlice.reducer;
