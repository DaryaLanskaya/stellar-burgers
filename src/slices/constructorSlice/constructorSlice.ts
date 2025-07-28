import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';

import { RootState } from 'src/services/store';

import { TConstructorIngredient, TIngredient } from '@utils-types';

// Тип для конструктора заказов
// Расширенная версия ингредиента с дополнительным уникальным идентификатором, необходимым для работы конструктора заказов.
export type TConstructorSlice = {
  constructorIngredients: TConstructorIngredient[]; // Содержит все ингредиенты бургера (кроме булки)
  constructorBun: TConstructorIngredient | null; //Содержит выбранную булку (верхнюю и нижнюю). Может быть null, если булка не выбрана
};
