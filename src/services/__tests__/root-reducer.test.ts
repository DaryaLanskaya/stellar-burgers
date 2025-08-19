import { rootReducer } from '../store';
import { configureStore } from '@reduxjs/toolkit';

// Описание тестового блока для проверки инициализации rootReducer
describe('Проверка правильной инициализации начального состояния rootReducer', () => {
  // Тест-кейс: проверка начального состояния редюсера
  it('Проверка правильной инициализации начального состояния rootReducer', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    // Создание "неизвестного" экшена для проверки дефолтного состояния
    const UNKNOWN_ACTION = {
      type: 'UNKNOWN_ACTION'
    };

    // Получение состояния редюсера при инициализации (undefined) и неизвестном экшене
    const state = rootReducer(undefined, UNKNOWN_ACTION);

    // Проверка, что начальное состояние редюсера совпадает с состоянием хранилища
    expect(state).toEqual(store.getState());
  });
});
