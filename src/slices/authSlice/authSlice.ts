import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { RootState } from 'src/services/store';

// Слайс аутентификации
export type TAuthSlice = TAuthResponse;

// Начальное состояние хранилища
export const initialState: TAuthSlice = {
  success: false, // изначально авторизация не выполнена
  user: {
    email: '', // почта
    name: '' // имя
  },
  accessToken: '', // токен для доступа к API
  refreshToken: '' // токен для обновления сессии
};

//  Обновление данных пользователя (updateUserApi)
export const getAuth = createAsyncThunk(
  'auth/getUser',
  async () => await getUserApi()
);

// Регистрация пользователя (registerUserApi)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

//  Выход из системы (logoutApi)
export const userLogout = createAsyncThunk(
  'auth/logout',
  async () => await logoutApi()
);

// Авторизация пользователя (loginUserApi)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: TLoginData) =>
    await loginUserApi({ email, password })
);

//  Обновление данных пользователя (updateUserApi)
// Обновляет данные пользователя на сервере
export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async (user: TRegisterData) => await updateUserApi(user)
);

// Создание слайса
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Редьюсер, который обрабатывает успешную авторизацию пользователя.
  reducers: {
    doLoginUserSuccess: (state, action) => {
      state.success = action.payload;
    }
  },

  extraReducers(builder) {
    builder
      // Загрузка началась
      .addCase(getAuth.pending, (state) => {
        state.success = false;
      })

      // Успешная загрузка
      .addCase(getAuth.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      // Ошибка
      .addCase(getAuth.rejected, (state, action) => {
        state.success = false;
      })

      // Загрузка началась
      .addCase(loginUser.pending, (state) => {
        state.success = false;
      })

      // Успешная загрузка
      .addCase(loginUser.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      // Ошибка
      .addCase(loginUser.rejected, (state, action) => {
        state.success = false;
      })

      // Загрузка началась
      .addCase(registerUser.pending, (state) => {
        state.success = false;
      })

      // Успешная загрузка
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      // Ошибка
      .addCase(registerUser.rejected, (state, action) => {
        state.success = false;
      })

      // Загрузка началась
      .addCase(updateUserData.pending, (state) => {
        state.success = false;
      })

      // Успешная загрузка
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      // Ошибка
      .addCase(updateUserData.rejected, (state, action) => {
        state.success = false;
      })

      // Загрузка началась
      .addCase(userLogout.pending, (state) => {
        state.success = false;
      })

      // Успешная загрузка
      .addCase(userLogout.fulfilled, (state, action) => {
        state.success = false;
        state.user = initialState.user;
      })

      // Ошибка
      .addCase(userLogout.rejected, (state, action) => {
        state.success = false;
      });
  }
});

const authSliceSelectors = (state: RootState) => state.auth; // Cелектор для Redux-стора, который позволяет получить доступ к состоянию (state) модуля аутентификации (auth)

// Создание селекторов для извлечения данных

// Получение информации о статусе аутентификаци
export const getStatus = createSelector(
  [authSliceSelectors],
  (state) => state.success
);

// Получение данных о пользователе
export const getUser = createSelector(
  [authSliceSelectors],
  (state) => state.user
);

export const { doLoginUserSuccess } = authSlice.actions; // Создаем и экспортируем готовый экшен

export const authSliceReducer = authSlice.reducer; // Редюсер, отвечающий за получение элементов
