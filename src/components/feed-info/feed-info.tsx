import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  getOrdersData,
  getTodayOrders,
  getTotalOrders
} from '../../slices/feedSlice/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(getOrdersData); // Данные по заказу
  const totalFeed = useSelector(getTotalOrders); // Заказы за  все время
  const todayFeed = useSelector(getTodayOrders); // Заказы за день

  // Получение заказов за день и за все время
  const feed = { total: totalFeed, totalToday: todayFeed };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
