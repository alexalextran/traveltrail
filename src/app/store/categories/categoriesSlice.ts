import { createSlice, PayloadAction, createSelector, createAsyncThunk} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Category } from '@/app/types/categoryData';
import { app } from "../../firebase";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { deletePinsByCategoryId } from '../pins/pinsSlice';

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
      categoryEmoji: ''
    },
    {
      categoryName: 'Category 2',
      categoryColor: '#00FF00',
      CategoryID: '2',
      categoryEmoji: ''
    },
    {
      categoryName: 'Category 3',
      categoryColor: '#0000FF',
      CategoryID: '3',
      categoryEmoji: ''
    },
  ],
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (userID: string) => {
    const querySnapshot = await getDocs(collection(db, `users/${userID}/categories`));
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


export const deleteCategoryAndRelatedPinsRedux = createAsyncThunk(
  'categories/deleteCategoryAndRelatedPins',
   (category: Category, { dispatch }) => {
    // Dispatch action to delete the category
    dispatch(deleteCategory( category ));
    // Dispatch action to delete related pins
    dispatch(deletePinsByCategoryId(category.categoryName));
  })

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    createCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action: PayloadAction<Category>) => {
      state.categories = state.categories.filter(category => category.CategoryID !== action.payload.CategoryID);
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