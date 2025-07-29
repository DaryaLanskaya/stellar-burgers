import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../slices/feedSlice/feedSlice';

import {
  selectBun,
  selectIngredients,
  resetConstructor
} from '../../slices/constructorSlice/constructorSlice';

import {
  getOrderStatusRequest,
  setLastOrder,
  getLastOrder,
  newOrder
} from '../../slices/orderSlice/orderSlice';

import { getStatus } from '../../slices/authSlice/authSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Данные из слайсов:
  const orderRequest = useSelector(getOrderStatusRequest); // Статус запроса заказа
  const constructorBun = useSelector(selectBun); // Выбранная булка
  const constructorIngredients = useSelector(selectIngredients); // Ингредиенты
  const isAuthenticated = useSelector(getStatus); // Авторизован ли пользователь
  const orderModalData = useSelector(getLastOrder); // Данные последнего заказа

  // Формируем объект с ингредиентами
  const constructorItems = {
    bun: constructorBun,
    ingredients: constructorIngredients
  };

  // Оформление заказа (onOrderClick)
  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login'); // Перенаправление на логин если не авторизован
    }
    if (!constructorItems.bun || orderRequest) return; //  // Проверка на булку и загрузку

    // Формируем массив ID ингредиентов: [булка, ...ингредиенты]
    const ingredientsId: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      )
    ];

    dispatch(newOrder(ingredientsId)); // Отправка заказа
    dispatch(resetConstructor()); // Очистка конструктора
    dispatch(getFeeds()); // Обновление ленты заказов
  };

  // Закрытие модального окна
  const closeOrderModal = () => dispatch(setLastOrder(null)); // Cбрасывает данные последнего заказа, закрывая модалку.

  // Расчет стоимости (useMemo)
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + // Цена булки (x2)
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price, // Сумма ингредиентов
        0
      ),
    [constructorItems] // Зависимости для пересчета
  );

  return (
    <BurgerConstructorUI
      price={price} // общая стоимость
      orderRequest={orderRequest} // статус заказа (для отображения лоадера).
      constructorItems={constructorItems} // текущие ингредиенты.
      orderModalData={orderModalData} // данные для модалки заказа.
      onOrderClick={onOrderClick} // обработчик кнопки "Оформить заказ".
      closeOrderModal={closeOrderModal} //закрытие модалки.
    />
  );
};
