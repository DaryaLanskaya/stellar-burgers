import { getFeedsApi, getOrderByNumberApi, TOrderResponse } from '@api'; // API для получения данных
import { TOrder, TOrdersData } from '@utils-types';
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { RootState } from '../../services/store';

// Тип для всех заказов
export type TFeedSlice = {
  feeds: TOrdersData;
  error: string | null | undefined; // Статус ошибки
  orderByNumber: TOrderResponse | null; // Номер заказа
};

// Начальное состояние хранилища
export const initialState: TFeedSlice = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  }, // Список заказов
  error: null, // Статус ошибки
  orderByNumber: null // Номер заказа
};

// Получаем данные о заказах
export const getFeeds = createAsyncThunk('feeds/getAll', getFeedsApi);

// Получаем заказ по номеру
export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderById',
  async (number: number) => getOrderByNumberApi(number)
);

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
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.orderByNumber = action.payload;
      })

      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

// Получение всего слайса feeds
const feedsSliceSelectors = (state: RootState) => state.feeds;

// Получение всех заказов из слайса
export const getOrdersData = createSelector(
  [feedsSliceSelectors],
  (state) => state.feeds.orders
);

// Получение заказов за день из слайса
export const getTodayOrders = createSelector(
  [feedsSliceSelectors],
  (state) => state.feeds.totalToday
);

// Получение всех заказов из слайса
export const getTotalOrders = createSelector(
  [feedsSliceSelectors],
  (state) => state.feeds.total
);

// Получение всех заказа по id
export const getOrderByNumberSelector = createSelector(
  [feedsSliceSelectors],
  (state) => state.orderByNumber?.orders[0]
);

// Проверка статуса текущего заказа
export const isSearchSuccessSelector = createSelector(
  [feedsSliceSelectors],
  (state) => state.orderByNumber?.success
);

export const feedSliceReducer = feedSlice.reducer; // Редюсер, отвечающий за получение элементов
