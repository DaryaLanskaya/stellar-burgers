import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderList, getOrders } from '../../slices/orderSlice/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrderList);

  useEffect(() => {
    dispatch(getOrders()).then((result) => {});
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
