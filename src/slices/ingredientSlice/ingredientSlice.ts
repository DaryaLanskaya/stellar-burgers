import { getIngredientsApi } from '@api'; // API для получения данных
import { TIngredient } from '@utils-types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Типизация слайса
export type TIngredientsSlice = {
  ingredients: TIngredient[];
  error: string | null | undefined;
};

// начальное состояние хранилища
export const initialState: TIngredientsSlice = {
  ingredients: [],
  error: null
};

// Получаем данные об ингредиентах
export const getIngredients = createAsyncThunk(
  // createAsyncThunk обрабатывает асинхронные запросы
  'ingredients/getAllIngredients',
  async () => getIngredientsApi()
);

// Создаём слайс
const ingredientsSlice = createSlice({
  name: 'ingredients', // Указывается уникальное название для слайса.
  initialState, // Указывается начальное состояние хранилища, за которое отвечает слайс
  reducers: {}, // Можно сразу описывать редюсеры и экшены, которые они обрабатывают.
  selectors: {
    getIngredientsData: (state) => state.ingredients // Селектор для получения элементов
  },

  // Можно добавить синхронные редьюсеры
  extraReducers(builder) {
    builder
      // Загрузка началась
      .addCase(getIngredients.pending, (state) => {
        state.error = null;
      })

      // Успешная загрузка
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.error = null;
          state.ingredients = action.payload;
        }
      )

      // Ошибка
      .addCase(getIngredients.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { getIngredientsData } = ingredientsSlice.selectors; // Получение элементов(ингредиентов) и статуса загрузки
export const ingredientsSliceReducer = ingredientsSlice.reducer; // Редюсер, отвечающий за получение элементов
