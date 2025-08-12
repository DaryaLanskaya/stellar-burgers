import { setCookie, getCookie } from './cookie'; // Отправка и получение куков.
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

// Это универсальная функция для проверки HTTP-ответов от API.
// Принимает объект Response и возвращает промис с типом <T>.
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

// Базовый тип для всех ответов сервера.
// Гарантирует наличие поля success: boolean.
type TServerResponse<T> = { success: boolean } & T;

// Оба токена являются JWT (JSON Web Tokens).
type TRefreshResponse = TServerResponse<{
  refreshToken: string; // Хранится в httpOnly cookie или localStorage. Используется ТОЛЬКО для получения нового accessToken.
  accessToken: string; // Содержит данные пользователя (в payload).
}>;

// Функция выполняет запрос к API для обновления JWT-токенов (access и refresh).
export const refreshToken = (): Promise<TRefreshResponse> => // — указывает, что функция возвращает Promise с типом TRefreshResponse (тип для ответа API).
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken') // В body передаётся текущий refreshToken из localStorage.
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res)) // Парсит JSON из ответа и типизирует его как TRefreshResponse.
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken); // Сохраняет новый refreshToken в localStorage и устанавливает accessToken в куки.
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

// Функция решает проблему истечения accessToken: Выполняет исходный запрос.Если токен просрочен (jwt expired):Автоматически обновляет токены через refreshToken().Повторяет исходный запрос с новым токеном.Возвращает данные или ошибку.
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

// Ответ для ингредиентов
type TIngredientsResponse = TServerResponse<{
  data: TIngredient[]; // Массив ингредиентов
}>;

//  Ответ для ленты заказов
type TFeedsResponse = TServerResponse<{
  orders: TOrder[]; // Список заказов
  total: number; // Всего заказов за всё время
  totalToday: number; // Заказов за сегодня
}>;

// Ответ для заказов пользователя
type TOrdersResponse = TServerResponse<{
  data: TOrder[]; // Массив заказов
}>;

// Отправляет GET-запрос к ${URL}/ingredients
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

// Отправляет GET-запрос к ${URL}/orders/all (все заказы)
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// Возвращает только массив заказов (data.orders)
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

// Реализует функционал оформления заказа бургера через API.
type TNewOrderResponse = TServerResponse<{
  order: TOrder; // Созданный заказ
  name: string; // Название заказа
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    // Тип для ответа при создании нового заказа:
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({ ingredients: data })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

// Если success: true - возвращает данные заказа
// Если success: false - отклоняет промис с данными ошибки

export type TOrderResponse = TServerResponse<{
  orders: TOrder[]; // Массив заказов
}>;

// Получение информации о заказе по его номеру.
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string; // электронная почта
  name: string; //  имя пользователя
  password: string; // пароль
};

// Описывает ответ сервера при аутентификации.
export type TAuthResponse = TServerResponse<{
  refreshToken: string; // токен для обновления сессии
  accessToken: string; // токен для доступа к API
  user: TUser; // данные пользователя (тип TUser)
}>;

// Регистрация пользователя (registerUserApi)
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = { email: string; password: string };

// Авторизация пользователя (loginUserApi)
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

//  Восстановление пароля (forgotPasswordApi)
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

//  Сброс пароля (resetPasswordApi) - Устанавливает новый пароль с использованием токена
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

// Получение данных пользователя (getUserApi). Получает данные авторизованного пользователя.Использует fetchWithRefresh для автоматического обновления токена.Тип ответа: { success: boolean, user: TUser }.Требует accessToken из cookies
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: { authorization: getCookie('accessToken') } as HeadersInit
  });

//  Обновление данных пользователя (updateUserApi)
// Обновляет данные пользователя на сервере
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

//  Выход из системы (logoutApi)
// Отправляет refreshToken на сервер для его инвалидации
// Очистка токенов происходит на стороне клиента
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
