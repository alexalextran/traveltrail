import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from "../../firebase";
import { RootState } from '../store';
import { Pin } from '../../types/pinData';

// Initialize Firestore
const db = getFirestore(app);

interface PinState {
  pins: Pin[];
  selectedPin: Pin | null;
}

const initialState: PinState = {
  pins: [
    
  ],
  selectedPin: null,
};


export const fetchPins = createAsyncThunk(
  'pins/fetchPins',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'users/alextran/pins'));
    const pinsArray: Pin[] = [];
    querySnapshot.forEach((doc) => {
      pinsArray.push({ id: doc.id, ...doc.data() } as Pin);
    });
    return pinsArray;
   
  }
);

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
    removePinById: (state, action: PayloadAction<string>) => { // Renamed from deletePin to removePinById
      state.pins = state.pins.filter(pin => pin.id !== action.payload);
    },
    selectPin: (state, action: PayloadAction<Pin>) => { 
      state.selectedPin = action.payload;
    },
    deletePinsByCategoryId: (state, action: PayloadAction<string>) => {
      state.pins = state.pins.filter(pin => pin.category !== action.payload);
    },
    addPictures: (state, action: PayloadAction<{id: string, picture: string[]}>) => {
      const pin = state.pins.find(pin => pin.id === action.payload.id);
      if (pin) {
        if (pin.imageUrls) {
          pin.imageUrls = pin.imageUrls.concat(action.payload.picture);
        } else {
          pin.imageUrls = action.payload.picture;
        }
      }
    },
    removeImageFromPin: (state, action: PayloadAction<{ pinId: string; imageUrl: string }>) => {
      const { pinId, imageUrl } = action.payload;
      const pin = state.pins.find(pin => pin.id === pinId);
      if (pin && pin.imageUrls) {
        pin.imageUrls = pin.imageUrls.filter(url => url !== `${imageUrl}`);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPins.fulfilled, (state, action) => {
      state.pins = action.payload;
    });
  },
});

export const { addPin, updatePin, removePinById, addPictures, selectPin, deletePinsByCategoryId, removeImageFromPin } = pinsSlice.actions;

export const selectPins = createSelector(
  (state: RootState) => state.pins,
  (pins) => pins.pins
);

export const selectSelectedPin = createSelector(
  (state: RootState) => state.pins,
  (selectedPin) => selectedPin.selectedPin
);



export default pinsSlice.reducer;