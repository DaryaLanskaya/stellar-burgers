import {
  ingredientsSliceReducer,
  getIngredients
} from '../../slices/ingredientSlice/ingredientSlice';

describe('Проверка экшенов в редьюсере ingredientsSlice', () => {
  // Тест для состояния pending (начало загрузки)
  test('При вызове экшена pending loading становится true, error сбрасывается', () => {
    // Начальное состояние с ошибкой (имитируем предыдущую ошибку)
    const initialStateWithError = {
      ingredients: [],
      loading: false,
      error: 'Previous error' // Была какая-то ошибка
    };

    // Создаем действие pending (начало загрузки)
    const action = {
      type: getIngredients.pending.type // Тип действия - начало загрузки
    };

    // Вызываем редюсер
    const resultState = ingredientsSliceReducer(initialStateWithError, action);

    // Проверяем соответствие требованиям:
    // 1. loading должен стать false
    expect(resultState.loading).toBe(false);
    // 2. error должен сброситься в null
    expect(resultState.error).toBeNull();
    // 3. ingredients не должны измениться
    expect(resultState.ingredients).toEqual([]);
  });

  // Тест для состояния fulfilled (успешное завершение)
  test('При вызове экшена fulfilled данные записываются в store, loading становится false', () => {
    // Начальное состояние (загрузка в процессе)
    const initialStateLoading = {
      ingredients: [],
      loading: true, // Загрузка в процессе
      error: null
    };

    // Тестовые данные - массив ингредиентов
    const testIngredients = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun', // Правильный тип для булки
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      },
      {
        _id: '2',
        name: 'Соус с шипами Антарианского плоскоходца',
        type: 'sauce',
        proteins: 101,
        fat: 99,
        carbohydrates: 100,
        calories: 100,
        price: 88,
        image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
      }
    ];

    // Создаем действие fulfilled (успешное завершение)
    const action = {
      type: getIngredients.fulfilled.type, // Тип действия - успешное завершение
      payload: testIngredients // Данные ингредиентов
    };

    // Вызываем редюсер
    const resultState = ingredientsSliceReducer(initialStateLoading, action);

    // Проверяем соответствие требованиям:
    // 1. loading должен стать true
    expect(resultState.loading).toBe(true);
    // 2. error должен остаться null (ошибок нет)
    expect(resultState.error).toBeNull();
    // 3. ingredients должны содержать полученные данные
    expect(resultState.ingredients).toEqual(testIngredients);
    // 4. Проверяем что данные действительно записались
    expect(resultState.ingredients).toHaveLength(2);
  });

  // Тест для состояния rejected (ошибка)
  test('При вызове экшена rejected error записывается в store, loading становится false', () => {
    // Начальное состояние (загрузка в процессе)
    const initialStateLoading = {
      ingredients: [],
      loading: true, // Загрузка в процессе
      error: null
    };

    // Тестовая ошибка
    const testError = new Error('Network error');

    // Создаем действие rejected (ошибка)
    const action = {
      type: getIngredients.rejected.type, // Тип действия - ошибка
      error: testError // Объект ошибки
    };

    // Вызываем редюсер
    const resultState = ingredientsSliceReducer(initialStateLoading, action);

    // Проверяем соответствие требованиям:
    // 1. loading должен стать true
    expect(resultState.loading).toBe(true);
    // 2. error должен содержать сообщение об ошибке
    expect(resultState.error).toBe(testError.message);
    // 3. ingredients не должны измениться
    expect(resultState.ingredients).toEqual([]);
  });
});
