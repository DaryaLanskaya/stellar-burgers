import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSliceReducer } from '../slices/ingredientSlice/ingredientSlice';

// const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера

// все редьюсеры объединяем в корневой
const rootReducer = combineReducers({ ingredients: ingredientsSliceReducer });

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
