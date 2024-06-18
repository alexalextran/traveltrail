// src/store/pinsSlice.ts
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Pin } from '../../types/pinData';

interface PinState {
  pins: Pin[];
}

const initialState: PinState = {
  pins: [
    {
      id: '1',
      address: '123 Dummy St, Dummy City, DS 12345',
      lat: 40.7128,
      lng: -74.0060,
      title: 'Dummy Pin',
      description: 'This is a dummy pin.',
      category: 'Place',
      visited: false,
    },
    {
      id: "rquvokz3o",
      title: "stay away",
      address: "AU, Level 1/203 Thomas St, Haymarket NSW 2000, Australia",
      description: "",
      lat: -33.8806844,
      lng: 151.2041748,
      category: "Place",
      visited: true
  }
  ],
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
    addPictures: (state, action: PayloadAction<{id: string, picture: string[]}>) => {
      const pin = state.pins.find(pin => pin.id === action.payload.id);
      if (pin) {
        if (pin.imageKeys) {
          pin.imageKeys = pin.imageKeys.concat(action.payload.picture);
        } else {
          pin.imageKeys = action.payload.picture;
        }
      }
    },
  },
});

export const { addPin, updatePin, deletePin, addPictures } = pinsSlice.actions;

export const selectPins = createSelector(
  (state: RootState) => state.pins,
  (pins) => pins.pins
);

export default pinsSlice.reducer;