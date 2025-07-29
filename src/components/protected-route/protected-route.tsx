import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getStatus } from '../../slices/authSlice/authSlice';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean; // Флаг "только для неавторизованных пользователей"
  redirectTo?: string; // Куда перенаправить, если доступ запрещён
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(getStatus); // Проверка токена
  const location = useLocation();
  console.log(isAuthenticated);
  // Если пользователь не авторизован или токен пользователя не обнаружен - то перенаправь на /login
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to={redirectTo} state={{ from: location }} />;
  }

  // Если маршрут НЕ требует авторизации, но пользователь авторизован
  // if (!onlyUnAuth && isAuthenticated) {
  //   const from = location.state?.from || { pathname: '/' };

  //   return <Navigate replace to={from} />; // Перенаправляем на главную
  // }

  // Если проверки пройдены — рендерим children
  return <>{children}</>;
};
