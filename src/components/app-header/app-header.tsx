import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { getUser } from '../../slices/authSlice/authSlice';
import { useSelector } from '../../services/store';

// Отображение имени в шапке приложения
export const AppHeader: FC = () => {
  const { name } = useSelector(getUser);

  return <AppHeaderUI userName={name} />;
};
