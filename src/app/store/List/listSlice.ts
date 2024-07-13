import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface SelectedListState {
    id: string
    listName: string
}

const initialState: SelectedListState = {
    id: '',
    listName: ''
};

const listSlice = createSlice({
    name: 'selectedList',
    initialState,
    reducers: {
        setSelectedListRedux: (state, action: PayloadAction<SelectedListState>) => {
            state.id = action.payload.id;
            state.listName = action.payload.listName;
        },
    },
});

export const { setSelectedListRedux } = listSlice.actions;

export const selectSelectedList = (state: RootState) => state.selectedList;

export default listSlice.reducer;
