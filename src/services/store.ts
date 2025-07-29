import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSliceReducer } from '../slices/ingredientSlice/ingredientSlice'; // Слайс ингредиента
import { feedSliceReducer } from '../slices/feedSlice/feedSlice'; // Слайс ленты заказов
import { authSliceReducer } from '../slices/authSlice/authSlice'; // Слайс аутентификации
import { orderSliceReducer } from '../slices/orderSlice/orderSlice'; // Слайс оформления заказов

// Все редьюсеры объединяем в корневой
const rootReducer = combineReducers({
  auth: authSliceReducer, // Слайс аутентификации
  ingredients: ingredientsSliceReducer, // Слайс ингредиента
  feeds: feedSliceReducer, // Слайс ленты заказов
  orders: orderSliceReducer // Слайс оформления заказов
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
