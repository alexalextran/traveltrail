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
    {
      categoryName: 'Category 1',
      categoryColor: '#FF0000',
      CategoryID: '1',
    },
    {
      categoryName: 'Category 2',
      categoryColor: '#00FF00',
      CategoryID: '2',
    },
    {
      categoryName: 'Category 3',
      categoryColor: '#0000FF',
      CategoryID: '3',
    },
  ],
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'users/alextran/categories'));
    const categoriesArray: Category[] = [];
    querySnapshot.forEach((doc) => {
      const categoryData = doc.data() as Category;
      const categoryWithID = {
        ...categoryData,
        CategoryID: doc.id
      };
      categoriesArray.push(categoryWithID);
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