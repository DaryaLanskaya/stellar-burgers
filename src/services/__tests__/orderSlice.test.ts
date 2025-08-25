import {
  orderSliceReducer,
  initialState
} from '../../slices/orderSlice/orderSlice';

import { getOrders, newOrder } from '../../slices/orderSlice/orderSlice';

import { TOrder } from '@utils-types';

// Mock-заглушка для API функций бургеров
// Заменяет реальные API вызовы на jest-функции для тестирования
jest.mock('../../utils/burger-api', () => ({
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api';

// Создание тестового объекта заказа с mock-данными
const mockOrder = {
  _id: '1', // Уникальный идентификатор заказа
  ingredients: ['ingredientSecond', 'ingredientLast'], // Массив ингредиентов бургера
  status: 'created', // Статус заказа (создан)
  name: 'Test Burger', // Название бургера
  createdAt: '2023-01-01T00:00:00.000Z', // Дата создания в ISO формате
  updatedAt: '2023-01-01T00:00:00.000Z', // Дата обновления в ISO формате
  number: 123 // Номер заказа
};

describe('Тестирование слайса заказов', () => {
  // Локальное определение mockOrder внутри describe для лучшей изоляции тестов
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ingredientSecond', 'ingredientLast'],
    status: 'created',
    name: 'Test Burger',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 123
  };

  // Функция, выполняемая перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks(); // Очищает все mock-вызовы для чистого состояния тестов
  });

  describe('Группа тестов для проверки начального состояния', () => {
    it('Должно возвращаться начальное состояние для неизвестного действия', () => {
      // Вызов редьюсера с undefined состоянием и неизвестным действием
      const result = orderSliceReducer(undefined, { type: 'UNKNOWN_ACTION' });
      // Проверка, что результат равен начальному состоянию
      expect(result).toEqual(initialState);
    });

    it('Тест: проверка корректной структуры начального состояния', () => {
      // Проверка, что initialState имеет ожидаемую структуру
      expect(initialState).toEqual({
        orders: [], // Пустой массив заказов
        lastOrder: null, // Последний заказ отсутствует
        orderRequestData: false, // Флаг запроса данных - false
        loading: false // Флаг загрузки - false
      });
    });
  });

  describe('Группа тестов для асинхронного действия получения заказов', () => {
    it('Тест: обработка состояния pending (ожидание) при получении заказов', () => {
      // Создание действия с типом pending для getOrders
      const action = { type: getOrders.pending.type };
      // Вызов редьюсера с начальным состоянием и действием
      const state = orderSliceReducer(initialState, action);

      // Проверка, что состояние изменилось: loading = true
      expect(state).toEqual({
        ...initialState, // Сохраняем все остальные поля
        loading: true // Устанавливаем флаг загрузки
      });
    });

    it('Тест: обработка успешного выполнения получения заказов', () => {
      // Создание массива mock-заказов
      const mockOrders: TOrder[] = [mockOrder, { ...mockOrder, _id: '2' }];
      // Создание действия с типом fulfilled и payload с заказами
      const action = {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      };

      // Вызов редьюсера с состоянием, где loading = true, и действием
      const state = orderSliceReducer(
        { ...initialState, loading: true },
        action
      );

      // Проверка, что состояние обновилось правильно
      expect(state).toEqual({
        ...initialState, // Сохраняем начальное состояние
        loading: false, // Сбрасываем флаг загрузки
        orders: mockOrders // Устанавливаем полученные заказы
      });
    });

    it('Тест: обработка ошибки при получении заказов', () => {
      // Создание действия с типом rejected и информацией об ошибке
      const action = {
        type: getOrders.rejected.type,
        error: { message: 'Error message' }
      };

      // Вызов редьюсера с состоянием, где loading = true, и действием
      const state = orderSliceReducer(
        { ...initialState, loading: true },
        action
      );

      // Проверка, что состояние вернулось к начальному, кроме loading = false
      expect(state).toEqual({
        ...initialState, // Сохраняем начальное состояние
        loading: false // Сбрасываем флаг загрузки
      });
    });
  });

  describe('Группа тестов для асинхронного действия создания нового заказа', () => {
    it('Тест: обработка состояния pending при создании заказа', () => {
      // Создание действия с типом pending для newOrder
      const action = { type: newOrder.pending.type };
      // Вызов редьюсера с начальным состоянием и действием
      const state = orderSliceReducer(initialState, action);

      // Проверка, что установлены оба флага загрузки
      expect(state).toEqual({
        ...initialState, // Сохраняем начальное состояние
        loading: true, // Устанавливаем общий флаг загрузки
        orderRequestData: true // Устанавливаем флаг запроса данных заказа
      });
    });

    it('Тест: обработка успешного создания заказа', () => {
      // Создание действия с типом fulfilled и payload с созданным заказом
      const action = {
        type: newOrder.fulfilled.type,
        payload: { order: mockOrder }
      };

      // Вызов редьюсера с состоянием, содержащим существующие заказы и флаги загрузки
      const state = orderSliceReducer(
        {
          ...initialState,
          loading: true,
          orderRequestData: true,
          orders: [{ ...mockOrder, _id: 'existing' }] // Существующий заказ
        },
        action
      );

      // Проверка полного обновления состояния
      expect(state).toEqual({
        ...initialState, // Сохраняем начальное состояние
        loading: false, // Сбрасываем общий флаг загрузки
        orderRequestData: false, // Сбрасываем флаг запроса данных
        orders: [{ ...mockOrder, _id: 'existing' }, mockOrder], // Добавляем новый заказ к существующим
        lastOrder: mockOrder // Устанавливаем последний заказ
      });
    });

    it('Тест: обработка ошибки при создании заказа', () => {
      // Создание действия с типом rejected и информацией об ошибке
      const action = {
        type: newOrder.rejected.type,
        error: { message: 'Возникла ошибка' }
      };

      // Вызов редьюсера с состоянием, где установлены флаги загрузки
      const state = orderSliceReducer(
        { ...initialState, loading: true, orderRequestData: true },
        action
      );

      // Проверка, что оба флага загрузки сброшены
      expect(state).toEqual({
        ...initialState, // Сохраняем начальное состояние
        loading: false, // Сбрасываем общий флаг загрузки
        orderRequestData: false // Сбрасываем флаг запроса данных
      });
    });
  });

  describe('Группа тестов для синхронного действия setLastOrder', () => {
    it(' Тест: проверка установки последнего заказа', () => {
      // Создание действия setLastOrder с payload - mock-заказом
      const action = {
        type: 'order/setLastOrder',
        payload: mockOrder
      };

      // Вызов редьюсера с начальным состоянием и действием
      const state = orderSliceReducer(initialState, action);

      // Проверка, что lastOrder установлен правильно
      expect(state).toEqual({
        ...initialState, // Сохраняем начальное состояние
        lastOrder: mockOrder // Устанавливаем последний заказ
      });
    });
  });

  describe('Группа тестов для проверки работы действий создателей', () => {
    it('Тест: проверка вызова API функции при dispatch getOrders', async () => {
      // Создание mock-функций для dispatch и getState
      const dispatch = jest.fn();
      const getState = jest.fn();

      // Настройка mock-функции getOrdersApi на возврат mock-заказов
      (getOrdersApi as jest.Mock).mockResolvedValue([mockOrder]);

      // Создание thunk-действия getOrders
      const action = getOrders();
      // Выполнение thunk-действия с mock-функциями
      await action(dispatch, getState, undefined);

      // Проверка, что getOrdersApi был вызван
      expect(getOrdersApi).toHaveBeenCalled();
    });

    it('Тест: проверка вызова API функции с правильными данными при dispatch newOrder', async () => {
      // Создание mock-функций для dispatch и getState
      const dispatch = jest.fn();
      const getState = jest.fn();
      // Массив ингредиентов для теста
      const ingredients = ['ingredientSecond', 'ingredientLast'];

      // Создание thunk-действия newOrder с массивом ингредиентов
      const action = newOrder(ingredients);
      // Выполнение thunk-действия с mock-функциями
      await action(dispatch, getState, undefined);

      // Проверка, что orderBurgerApi был вызван с правильным массивом ингредиентов
      expect(orderBurgerApi).toHaveBeenCalledWith(ingredients);
    });
  });
});
