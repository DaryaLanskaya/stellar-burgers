import {
  burgerConstructorSliceReducer,
  addIngredient,
  initialState,
  removeIngredient,
  moveIngredientUp
} from '../../slices/constructorSlice/constructorSlice';

describe('Тест на проверку экшенов в редьюсере constructor', () => {
  // Обработка экшена добавления ингредиента
  it('Обработка экшена добавления ингредиента', () => {
    const addTestIngredient = {
      _id: '643d69a5c3f7b9001cfa0945',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
    };

    // Вызов редюсера с начальным состоянием и экшеном добавления ингредиента
    const addState = burgerConstructorSliceReducer(
      initialState,
      addIngredient(addTestIngredient)
    );

    // Деструктуризация первого ингредиента из состояния: извлекаем id отдельно, остальные свойства в expected
    const { id, ...expected } = addState.ingredients[0];

    // Проверка: все свойства добавленного ингредиента (кроме сгенерированного id) должны совпадать с тестовыми
    expect(expected).toEqual(addTestIngredient);
  });

  // Обработка экшена удаления ингредиента
  it('Обработка экшена удаления ингредиента', () => {
    const removeTestIngredient = {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };
    // 1. Добавляем булку
    const stateWithBun = burgerConstructorSliceReducer(
      initialState,
      addIngredient(removeTestIngredient)
    );

    // 2. Булка должна быть в отдельном поле, а не в массиве ingredients
    expect(stateWithBun.bun).toBeDefined();
    expect(stateWithBun.ingredients).toHaveLength(0); // ingredients пустой

    // 3. Получаем id булки
    const bunId = stateWithBun.bun?.id;
    expect(bunId).toBeDefined();

    // 4. Пытаемся удалить булку (но она не в массиве ingredients!)
    const stateAfterRemoveAttempt = burgerConstructorSliceReducer(
      stateWithBun,
      removeIngredient(bunId!)
    );

    // 5. Булка должна остаться, так как removeIngredient работает только с массивом ingredients
    expect(stateAfterRemoveAttempt.bun).toBeDefined(); // Булка на месте
    expect(stateAfterRemoveAttempt.ingredients).toHaveLength(0); // Массив пустой
  });

  // Обработка экшена изменения порядка ингредиентов в начинке
  it('Обработка экшена изменения порядка ингредиентов в начинке(перемещение ингредиента вверх по списку)', () => {
    const moveTestIngredientFirst = {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'main',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };

    const moveTestIngredientSecond = {
      _id: '2',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
    };

    // 1. Добавляем все ингредиенты в конструктор
    let state = burgerConstructorSliceReducer(
      initialState,
      addIngredient(moveTestIngredientFirst) // Добавляем первым
    );

    state = burgerConstructorSliceReducer(
      state,
      addIngredient(moveTestIngredientSecond) // Добавляем вторым
    );

    // Проверяем начальный порядок: [moveTestIngredientFirst, moveTestIngredientSecond]
    expect(state.ingredients).toHaveLength(2);

    // 2. Получаем id ВТОРОГО ингредиента (который будем перемещать вверх)
    const ingredientToMoveId = state.ingredients[1].id;

    // 3. Перемещаем второй ингредиент вверх
    const stateAfterMove = burgerConstructorSliceReducer(
      state,
      moveIngredientUp(ingredientToMoveId)
    );

    // 4. Проверяем новый порядок: [moveTestIngredientSecond, moveTestIngredientFirst]
    expect(stateAfterMove.ingredients).toHaveLength(2);

    // Проверяем содержимое без id (так как id генерируются автоматически)
    const { id: id1, ...firstIngredientWithoutId } =
      stateAfterMove.ingredients[0];
    expect(firstIngredientWithoutId).toEqual(moveTestIngredientSecond);

    const { id: id2, ...secondIngredientWithoutId } =
      stateAfterMove.ingredients[1];
    expect(secondIngredientWithoutId).toEqual(moveTestIngredientFirst);
  });
});
