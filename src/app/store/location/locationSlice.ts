import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface LocationState {
    lat: number;
    lng: number;
    timestamp?: string; // Add a timestamp to force updates
}


const initialState: LocationState = {
    lat: 0,
    lng: 0,
    timestamp: Date.now().toString(),
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<LocationState>) => {
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
            state.timestamp = Date.now().toString(); // Add a timestamp to make the state unique
        },
    },
});

export const { setLocation } = locationSlice.actions;

export const selectLocation = (state: RootState) => state.location;

export default locationSlice.reducer;
