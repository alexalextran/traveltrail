import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface LocationState {
    lat: number;
    lng: number;
}



const initialState: LocationState = {
    lat: 0,
    lng: 0,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<LocationState>) => {
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
        },
    },
});

export const { setLocation } = locationSlice.actions;

export const selectLocation = (state: RootState) => state.location;

export default locationSlice.reducer;
