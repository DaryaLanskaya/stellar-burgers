import { getFeedsApi } from '@api'; // API для получения данных
import { TOrder, TOrdersData } from '@utils-types';
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { RootState } from 'src/services/store';

// Тип для звсех тзаказов
export type TFeedSlice = {
  feeds: TOrdersData;
  error: string | null | undefined; // Статус ошибки
};

// начальное состояние хранилища
export const initialState: TFeedSlice = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  }, // Список заказов
  error: null // Статус ошибки
};

// Получаем данные о заказах
export const getFeeds = createAsyncThunk('feeds/getAll', getFeedsApi);

// Создаём слайс
const feedSlice = createSlice({
  name: 'feeds', // Указывается уникальное название для слайса.
  initialState, // Указывается начальное состояние хранилища, за которое отвечает слайс
  reducers: {}, // Можно сразу описывать редюсеры и экшены, которые они обрабатывают.
  selectors: {
    getFeedsData: (state) => state.feeds // Селектор для получения элементов
  },

  // Можно добавить синхронные редьюсеры
  extraReducers(builder) {
    builder
      // Загрузка началась
      .addCase(getFeeds.pending, (state) => {
        state.error = null;
      })

      // Успешная загрузка
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.error = null;
        state.feeds.orders = action.payload.orders;
        state.feeds.total = action.payload.total;
        state.feeds.totalToday = action.payload.totalToday;
      })

      // Ошибка
      .addCase(getFeeds.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

// получение всего слайса feeds
const feedsSliceSelectors = (state: RootState) => state.feeds;

export const getOrdersData = createSelector(
  [feedsSliceSelectors],
  (state) => state.feeds.orders
);

// export const { getFeedsData } = feedSlice.selectors; // Получение элементов(заказов)
export const feedSliceReducer = feedSlice.reducer; // Редюсер, отвечающий за получение элементов
