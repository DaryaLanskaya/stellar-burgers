// import {
//   createSlice,
//   createAsyncThunk,
//   createSelector,
//   nanoid
// } from '@reduxjs/toolkit';

// import { RootState } from 'src/services/store';

// import { TConstructorIngredient, TIngredient } from '@utils-types';

// // Тип для конструктора заказов
// // Расширенная версия ингредиента с дополнительным уникальным идентификатором, необходимым для работы конструктора заказов.
// export type TConstructorSlice = {
//   constructorIngredients: TConstructorIngredient[]; // Содержит все ингредиенты бургера (кроме булки)
//   constructorBun: TConstructorIngredient | null; //Содержит выбранную булку (верхнюю и нижнюю). Может быть null, если булка не выбрана
// };

// // Начальное состояние хранилища
// export const initialState: TConstructorSlice = {
//   constructorIngredients: [],
//   constructorBun: null
// };

// const сonstructorSlice = createSlice({
//   name: 'сonstructorBurger', // Уникальное имя слайса
//   initialState, // Начальное состояние
//   reducers: { // Определение редьюсеров и экшенов
//     addIngredientConstructor: {

//       prepare: (item: TIngredient) => { // Подготовка экшена (prepare)
//         const id = nanoid(); // Генерация уникального ID
//         return { payload: { id, ...item } }; // Формируем payload
//       },

//       reducer: (state, action: PayloadAction<TConstructorIngredient>) => { // Обработка экшена (reducer)
//         action.payload.type === 'bun'
//           ? (state.constructorBun = action.payload) // Для булок
//           : state.constructorIngredients.push(action.payload); // Для других ингредиентов
//       }
//     },
