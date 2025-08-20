import {
  authSliceReducer,
  initialState
} from '../../slices/authSlice/authSlice';

import {
  getAuth,
  loginUser,
  registerUser,
  updateUserData,
  userLogout
} from '../../slices/authSlice/authSlice';

import { TAuthResponse } from '../../utils/burger-api';

// Моковые данные для тестов - имитируют реальные ответы от API
const mockUserData = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockAuthResponse: TAuthResponse = {
  success: true, // Успешный ответ сервера
  user: mockUserData, // Данные пользователя
  accessToken: '', // Токен доступа (пустой для теста)
  refreshToken: '' // Токен обновления (пустой для теста)
};

const mockErrorResponse = {
  message: 'Возникла ошибка' // Сообщение об ошибке
};

// Основной блок тестов для редьюсера authSlice
describe('authSlice reducer', () => {
  it('Тест начального состояния редьюсера', () => {
    // Проверяем, что редьюсер возвращает initialState при вызове без действия
    expect(authSliceReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // Группа тестов для асинхронного действия getAuth (получение данных пользователя)
  describe('Группа тестов для асинхронного действия getAuth (получение данных пользователя)', () => {
    it('Тест состояния pending (запрос отправлен)', () => {
      const action = { type: getAuth.pending.type }; // Создаем действие pending
      const state = authSliceReducer(initialState, action); // Применяем к редьюсеру

      // Проверяем, что состояние изменилось правильно:
      // loading: false - запрос начался, но еще не завершен
      // success: false - успешность сброшена
      expect(state).toEqual({
        ...initialState,
        loading: false,
        success: false
      });
    });

    it('Тест состояния fulfilled (успешное выполнение)', () => {
      const action = {
        type: getAuth.fulfilled.type,
        payload: mockAuthResponse // Моковые данные ответа
      };
      const state = authSliceReducer(initialState, action);

      // Проверяем, что при успешном ответе:
      // loading: true - запрос завершен
      // success: true - операция успешна
      // user, accessToken, refreshToken заполнены данными из payload
      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: true,
        user: mockUserData,
        accessToken: '',
        refreshToken: ''
      });
    });

    it('Тест состояния rejected (ошибка)', () => {
      const action = {
        type: getAuth.rejected.type,
        error: mockErrorResponse // Моковая ошибка
      };
      const state = authSliceReducer(initialState, action);

      // Проверяем, что при ошибке:
      // loading: true - запрос завершен (но с ошибкой)
      // success: false - операция не удалась
      // остальные данные остаются без изменений
      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: false
      });
    });
  });

  describe('Группа тестов для асинхронного действия loginUser (авторизация)', () => {
    it('Тест состояния pending (запрос отправлен)', () => {
      const action = { type: loginUser.pending.type };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        success: false
      });
    });

    it('Тест состояния fulfilled (успешное выполнение)', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: true,
        user: mockUserData,
        accessToken: '',
        refreshToken: ''
      });
    });

    it('Тест состояния rejected (ошибка)', () => {
      const action = {
        type: loginUser.rejected.type,
        error: mockErrorResponse
      };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: false
      });
    });
  });

  describe('Группа тестов для асинхронного действия registerUser (регистрация)', () => {
    it('Тест состояния pending (запрос отправлен)', () => {
      const action = { type: registerUser.pending.type };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        success: false
      });
    });

    it('Тест состояния fulfilled (успешное выполнение)', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: true,
        user: mockUserData,
        accessToken: '',
        refreshToken: ''
      });
    });

    it('Тест состояния rejected (ошибка)', () => {
      const action = {
        type: registerUser.rejected.type,
        error: mockErrorResponse
      };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: false
      });
    });
  });

  describe('Группа тестов для асинхронного действия updateUserData (обновление данных)', () => {
    // Моковые данные для обновленного пользователя
    const updatedUserData = {
      email: 'updated@example.com',
      name: 'Updated User'
    };

    // Моковый ответ с обновленными данными
    const updatedAuthResponse: TAuthResponse = {
      ...mockAuthResponse,
      user: updatedUserData
    };

    it('Тест состояния pending (запрос отправлен)', () => {
      const action = { type: updateUserData.pending.type };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        success: false
      });
    });

    it('Тест состояния fulfilled (успешное выполнение)', () => {
      const action = {
        type: updateUserData.fulfilled.type,
        payload: updatedAuthResponse
      };
      const state = authSliceReducer(initialState, action);

      // Проверяем, что данные пользователя обновились
      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: true,
        user: updatedUserData,
        accessToken: '',
        refreshToken: ''
      });
    });

    it('Тест состояния rejected (ошибка)', () => {
      const action = {
        type: updateUserData.rejected.type,
        error: mockErrorResponse
      };
      const state = authSliceReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: false
      });
    });
  });

  describe('Группа тестов для асинхронного действия userLogout (выход из системы)', () => {
    // Состояние с авторизованным пользователем для тестов выхода
    const loggedInState = {
      ...initialState,
      success: true,
      user: mockUserData,
      accessToken: '',
      refreshToken: ''
    };

    it('Тест состояния pending (запрос отправлен)', () => {
      const action = { type: userLogout.pending.type };
      const state = authSliceReducer(loggedInState, action);

      // При начале выхода: success сбрасывается, loading остается false
      expect(state).toEqual({
        ...loggedInState,
        loading: false,
        success: false
      });
    });

    it('Тест состояния fulfilled (успешное выполнение)', () => {
      const action = {
        type: userLogout.fulfilled.type,
        payload: { success: true }
      };
      const state = authSliceReducer(loggedInState, action);

      // При успешном выходе: возвращаемся к initialState, но с loading: true
      // Все пользовательские данные и токены сбрасываются
      expect(state).toEqual({
        ...initialState,
        loading: true,
        success: false,
        user: initialState.user
      });
    });

    it('Тест состояния rejected (ошибка)', () => {
      const action = {
        type: userLogout.rejected.type,
        error: mockErrorResponse
      };
      const state = authSliceReducer(loggedInState, action);

      // При ошибке выхода: success сбрасывается, но данные пользователя остаются
      // loading становится true (запрос завершен с ошибкой)
      expect(state).toEqual({
        ...loggedInState,
        loading: true,
        success: false
      });
    });
  });

  describe('Тесты для синхронного действия doLoginUserSuccess', () => {
    it('should handle doLoginUserSuccess', () => {
      const action = {
        type: 'auth/doLoginUserSuccess', // Тип синхронного действия
        payload: true // Полезная нагрузка - флаг успеха
      };
      const state = authSliceReducer(initialState, action);

      // Проверяем, что действие меняет только success флаг
      expect(state).toEqual({
        ...initialState,
        success: true
      });
    });
  });
});
