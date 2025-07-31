import {
  createSlice,
  PayloadAction,
  createSelector,
  nanoid // для создания id
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../../services/store';

/**
 * Тип состояния конструктора бургера.
 * Содержит:
 * - ingredients: массив ингредиентов (кроме булки)
 * - bun: текущая выбранная булка (или null если не выбрана)
 */
type BurgerConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

// Начальное состояние конструктора бургера
const initialState: BurgerConstructorState = {
  ingredients: [], // Пустой массив ингредиентов
  bun: null // Булка не выбрана
};

/**
 * Находит индекс ингредиента в массиве по его ID.
 * @param items Массив ингредиентов
 * @param id Идентификатор ингредиента
 * @returns Индекс элемента или -1 если не найден
 */
const findIngredientIndex = (items: TConstructorIngredient[], id: string) =>
  items.findIndex((item) => item.id === id);

/**
 * Перемещает ингредиент в массиве вверх или вниз.
 * @param items Исходный массив ингредиентов
 * @param id ID перемещаемого ингредиента
 * @param direction Направление ('up' или 'down')
 * @returns Новый массив с измененным порядком элементов
 */
const moveIngredient = (
  items: TConstructorIngredient[],
  id: string,
  direction: 'up' | 'down'
) => {
  const index = findIngredientIndex(items, id);
  if (index === -1) return items; // Если элемент не найден, возвращаем исходный массив

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  // Проверяем, чтобы новый индекс был в пределах массива
  if (newIndex < 0 || newIndex >= items.length) return items;

  // Создаем новый массив (для иммутабельности)
  const newItems = [...items];
  // Извлекаем перемещаемый элемент
  const [movedItem] = newItems.splice(index, 1);
  // Вставляем его на новую позицию
  newItems.splice(newIndex, 0, movedItem);
  return newItems;
};

// Создание слайса Redux для конструктора бургера
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor', // Уникальное имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Объект редьюсеров
    /**
     * Добавление нового ингредиента в конструктор.
     * Для булки заменяет текущую, для остальных - добавляет в конец списка.
     */
    addIngredient: {
      // Подготовка payload - добавляем уникальный ID к ингредиенту
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      }),
      // Обработка добавления ингредиента
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        payload.type === 'bun'
          ? (state.bun = payload) // Для булки заменяем текущую
          : state.ingredients.push(payload); // Для остальных добавляем в массив
      }
    },

    /**
     * Удаление ингредиента из конструктора по ID.
     */
    removeIngredient: (state, { payload: id }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== id);
    },

    /**
     * Перемещение ингредиента вверх по списку.
     */
    moveIngredientUp: (state, { payload: id }: PayloadAction<string>) => {
      state.ingredients = moveIngredient(state.ingredients, id, 'up');
    },

    /**
     * Перемещение ингредиента вниз по списку.
     */
    moveIngredientDown: (state, { payload: id }: PayloadAction<string>) => {
      state.ingredients = moveIngredient(state.ingredients, id, 'down');
    },

    /**
     * Сброс конструктора в начальное состояние.
     */
    resetConstructor: () => initialState
  }
});

// ===== Селекторы ===== //

/**
 * Базовый селектор для получения всего состояния конструктора.
 */
const selectConstructorState = (state: RootState) => state.constructorItems;

/**
 * Селектор для получения текущей булки.
 * Мемоизирован с помощью createSelector.
 */
export const selectBun = createSelector(
  [selectConstructorState],
  (state) => state.bun
);

/**
 * Селектор для получения списка ингредиентов (кроме булки).
 * Мемоизирован с помощью createSelector.
 */
export const selectIngredients = createSelector(
  [selectConstructorState],
  (state) => state.ingredients
);

/**
 * Комбинированный селектор для получения всех элементов конструктора.
 * Возвращает объект с булкой и ингредиентами.
 */
export const selectConstructorItems = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => ({ bun, ingredients })
);

// ===== Экспорты ===== //

// Экспорт действий (actions) для использования в компонентах
export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} = burgerConstructorSlice.actions;

// Экспорт редьюсера по умолчанию для подключения в хранилище
// export default burgerConstructorSlice.reducer;

export const burgerConstructorSliceReducer = burgerConstructorSlice.reducer;
