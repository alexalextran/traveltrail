import { createSlice, PayloadAction, createSelector, createAsyncThunk} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Category } from '@/app/types/categoryData';
import { app } from "../../firebase";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [
    { categoryName: "Restaurant", categoryColor: "#FF0000" },
    { categoryName: "Bar", categoryColor: "#00FF00" },
    { categoryName: "Place", categoryColor: "#0000FF" },
  ],
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'users/alextran/categories'));
    const categoriesArray: Category[] = [];
    querySnapshot.forEach((doc) => {
      categoriesArray.push(doc.data() as Category);
    });
    return categoriesArray;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    createCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.categoryName !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export const { createCategory, deleteCategory } = categoriesSlice.actions;

export const selectCategories = createSelector(
  (state: RootState) => state.categories,
  (categories) => categories.categories
);

export default categoriesSlice.reducer;