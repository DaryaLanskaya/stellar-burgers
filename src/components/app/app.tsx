import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

import '../../index.css';

import styles from './app.module.css';

import { useEffect } from 'react';

import { useDispatch } from '../../../src/services/store';

function App() {
  const location = useLocation(); // Возвращает текущее местоположение.
  const background = location.state?.background; // Нужно для безопасного доступа к данным, переданным через состояние навигации.
  const navigate = useNavigate(); // Возвращает функцию, которая позволяет программно перемещаться по страницам браузера в ответ на действия пользователя или внешние эффекты.

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />
        <Route path='*' element={<NotFound404 />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route path='/profile/orders/:number' element={<OrderInfo />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={handleClose} title=''>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={handleClose} title='Детали ингридиента'>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <Modal onClose={handleClose} title=''>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
