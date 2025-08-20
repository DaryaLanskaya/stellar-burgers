import {
  getFeeds,
  getOrderByNumber,
  feedSliceReducer,
  initialState
} from '../../slices/feedSlice/feedSlice';

// Мокируем API функции с помощью Jest
jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

// Импортируем мокированные функции после мокирования
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrderResponse } from '../../utils/burger-api';

// Типизируем моки для лучшей поддержки
const mockedGetFeedsApi = getFeedsApi as jest.Mock; // Приводим тип к jest.Mock для автодополнения
const mockedGetOrderByNumberApi = getOrderByNumberApi as jest.Mock;

describe('Группа тестов для редюсеров и extraReducers', () => {
  // После каждого теста очищаем все моки
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Группа тестов для проверки начального состояния', () => {
    it('Должно быть возвращено исходное состояние', () => {
      // Вызываем редюсер с undefined состоянием и неизвестным экшеном
      const state = feedSliceReducer(undefined, { type: 'unknown' });
      // Проверяем, что возвращается initialState
      expect(state).toEqual(initialState);
    });
  });

  describe('Асинхронный запуск getFeeds', () => {
    // Создаем mock-данные для тестирования успешного ответа
    const mockFeedsData = {
      orders: [
        { id: 1, name: 'OrderSecond' },
        { id: 2, name: 'OrderLast' }
      ],
      total: 100, // Mock общее количество заказов
      totalToday: 10 // Mock количество заказов за сегодня
    };

    it('Тест для состояния pending (начало загрузки)', () => {
      // Создаем экшен типа pending
      const action = { type: getFeeds.pending.type };
      // Вызываем редюсер с initialState и созданным экшеном
      const state = feedSliceReducer(initialState, action);

      // Проверяем, что состояние соответствует ожиданиям
      expect(state).toEqual({
        ...initialState,
        error: null // Ожидаем, что ошибка сбросится
        // isLoading не явно, но состояние "загрузки" началось
      });
    });

    it('Тест для состояния fulfilled (успешное завершение)', () => {
      const action = {
        // Создаем экшен типа fulfilled с payload данных
        type: getFeeds.fulfilled.type,
        payload: mockFeedsData // Передаем mock-данные в payload
      };

      // Вызываем редюсер
      const state = feedSliceReducer(initialState, action);

      // Проверяем результат
      expect(state).toEqual({
        ...initialState, // Все остальные поля без изменений
        feeds: mockFeedsData, // Данные должны быть записаны в хранилище
        error: null // Ошибки нет, так как запрос успешен
      });
    });

    it('Тест для состояния rejected (ошибка)', () => {
      const errorMessage = 'Ошибка выполнения'; // Сообщение об ошибке для теста

      // Создаем экшен типа rejected с информацией об ошибке
      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage } // Структура ошибки как в Redux Toolkit
      };

      // Вызываем редюсер
      const state = feedSliceReducer(initialState, action);

      // Проверяем результат
      expect(state).toEqual({
        ...initialState, // Все остальные поля без изменений
        error: errorMessage, // Ошибка записана в хранилище
        feeds: initialState.feeds // Данные не изменились (остались初始льные)
      });
    });
  });

  describe('Группа тестов для асинхронной задачи getOrderByNumber', () => {
    // Создаем mock-ответ API для поиска заказа по номеру
    const mockOrderResponse: TOrderResponse = {
      success: true,
      orders: [
        // Массив найденных заказов
        {
          _id: '555', // ID заказа
          ingredients: ['ingSecond', 'ingLast'], // Ингредиенты заказа
          status: 'done', // Статус заказа
          name: 'Order 555', // Название заказа
          number: 555, // Номер заказа
          createdAt: '2023-10-10', // Дата создания
          updatedAt: '2023-10-10' // Дата обновления
        }
      ]
    };

    it('Тест для состояния pending', () => {
      // Создаем экшен типа pending
      const action = { type: getOrderByNumber.pending.type };

      // Вызываем редюсер
      const state = feedSliceReducer(initialState, action);

      // Проверяем результат
      expect(state).toEqual({
        ...initialState, // Все остальные поля без изменений
        error: null // Ожидаем, что ошибка сбросится при начале новой загрузки
      });
    });

    it('Тест для состояния fulfilled', () => {
      // Создаем экшен типа fulfilled с payload данных заказа
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrderResponse // Передаем mock-ответ
      };

      // Вызываем редюсер
      const state = feedSliceReducer(initialState, action);

      // Проверяем результат
      expect(state).toEqual({
        ...initialState, // Все остальные поля без изменений
        orderByNumber: mockOrderResponse, // Данные заказа записаны в хранилище
        error: null // Ошибки нет, так как запрос успешен
      });
    });

    it('Тест для состояния rejected', () => {
      const errorMessage = ' Ошибка. Заказ не найден.'; // Сообщение об ошибке

      // Создаем экшен типа rejected
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage } // Информация об ошибке
      };

      // Вызываем редюсер
      const state = feedSliceReducer(initialState, action);

      // Проверяем результат
      expect(state).toEqual({
        ...initialState, // Все остальные поля без изменений
        error: errorMessage, // Ошибка записана в хранилище
        orderByNumber: null // Данные заказа не изменились (остались null)
      });
    });
  });
});
