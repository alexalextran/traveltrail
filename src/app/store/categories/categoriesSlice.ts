// src/store/categoriesSlice.ts
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CategoryState {
  categories: string[];
}

const initialState: CategoryState = {
  categories: ["Restaurant", "Bar", "Place"],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<string>) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category !== action.payload);
    },
  },
});

export const { addCategory, deleteCategory } = categoriesSlice.actions;

export const selectCategories = createSelector(
  (state: RootState) => state.categories,
  (categories) => categories.categories
);

export default categoriesSlice.reducer;