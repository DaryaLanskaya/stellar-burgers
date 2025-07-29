import { getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

// Тип слайса оформления заказа. Код создает Redux-слайс для управления заказами в React-приложении.
type TOrderSlice = {
  orders: TOrder[]; // Массив всех заказов
  lastOrder: TOrder | null; // Последний созданный заказ
  orderRequestData: boolean; // Статус запроса данных о заказе
  loading: boolean; // Статус загрузки
};

// Начальное состояние хранилища
export const initialState: TOrderSlice = {
  orders: [], // Пустой массив заказов
  lastOrder: null,
  orderRequestData: false, // Нет активных запросов
  loading: false
};

// Обращение к глобальному хранилищу
const orderSliceSelectors = (state: RootState) => state.orders;

// Получение заказов пользователя
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async () => await getOrdersApi()
);

// Создание нового заказа
export const newOrder = createAsyncThunk(
  'order/newOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

// Cоздание слайса
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLastOrder: (state, action) => {
      // setLastOrder для ручного обновления последнего заказа
      state.lastOrder = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      // Начало загрузки
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })

      // Сохранение полученных заказов
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      // Ошибка загрузки
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
      })

      // Начало загрузки
      .addCase(newOrder.pending, (state) => {
        state.loading = true;
        state.orderRequestData = true; // Начало создания заказа
      })

      // Сохранение полученных заказов
      .addCase(newOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload.order); // Добавление нового заказа
        state.lastOrder = action.payload.order; // Сохранение последнего заказа
        state.orderRequestData = false;
      })

      // Ошибка загрузки
      .addCase(newOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderRequestData = false;
      });
  }
});

// Код отвечает за получение списка заказов
export const getOrderList = createSelector(
  [orderSliceSelectors],
  (state) => state.orders
);

// Код,  который получает статус запроса заказа из хранилища.
export const getOrderStatusRequest = createSelector(
  [orderSliceSelectors],
  (state) => state.orderRequestData
);

// Получение последнего заказа
export const getLastOrder = createSelector(
  [orderSliceSelectors],
  (state) => state.lastOrder
);

export const { setLastOrder } = orderSlice.actions; // Создаем и экспортируем готовый экшен

export const orderSliceReducer = orderSlice.reducer; // Редюсер, отвечающий за получение элементов
