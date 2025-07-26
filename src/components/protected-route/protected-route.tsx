import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthRequired?: boolean; // Нужна ли авторизация
  redirectTo?: string; // Куда перенаправить, если доступ запрещён
}

export const ProtectedRoute = ({
  children,
  isAuthRequired = true,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Проверка токена
  const location = useLocation();

  // Если маршрут требует авторизации, но пользователь не авторизован
  if (isAuthRequired && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Если маршрут НЕ требует авторизации, но пользователь авторизован
  if (!isAuthRequired && isAuthenticated) {
    return <Navigate to='/' replace />; // Перенаправляем на главную
  }

  // Если проверки пройдены — рендерим children
  return <>{children}</>;
};
