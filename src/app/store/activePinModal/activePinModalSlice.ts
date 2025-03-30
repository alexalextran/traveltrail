import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActivePinModalState {
  activePinID: string | null;
}

const initialState: ActivePinModalState = {
  activePinID: null,
};

const activePinModalSlice = createSlice({
  name: "activePinModal",
  initialState,
  reducers: {
    setActivePin(state, action: PayloadAction<string | null>) {
      state.activePinID = action.payload;
    },
  },
});

export const { setActivePin } = activePinModalSlice.actions;
export const selectActivePin = (state: any) => state.activePinModal.activePinID;
export default activePinModalSlice.reducer;
