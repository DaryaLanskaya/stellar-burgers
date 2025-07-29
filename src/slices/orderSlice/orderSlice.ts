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

// Получение заказов пользователя
export const getUserOrders = createAsyncThunk(
  'user/getUserOrders',
  async () => await getOrdersApi()
);

// Создание нового заказа
export const newUserOrder = createAsyncThunk(
  'user/newUserOrder',
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
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })

      // Сохранение полученных заказов
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      // Ошибка загрузки
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
      })

      // Начало загрузки
      .addCase(newUserOrder.pending, (state) => {
        state.loading = true;
        state.orderRequestData = true; // Начало создания заказа
      })

      // Сохранение полученных заказов
      .addCase(newUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload.order); // Добавление нового заказа
        state.lastOrder = action.payload.order; // Сохранение последнего заказа
        state.orderRequestData = false;
      })

      // Ошибка загрузки
      .addCase(newUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderRequestData = false;
      });
  }
});

export const { setLastOrder } = orderSlice.actions;
export const userSliceReducer = orderSlice.reducer;
