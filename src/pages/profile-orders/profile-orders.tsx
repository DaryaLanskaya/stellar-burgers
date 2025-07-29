import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getOrderList } from '../../slices/orderSlice/orderSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getOrderList);

  return <ProfileOrdersUI orders={orders} />;
};
