import { ProfileUI } from '@ui-pages';
import { TUser } from '@utils-types';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUserData } from '../../slices/authSlice/authSlice';

// Код реализует компонент профиля пользователя с возможностью редактирования данных.
export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user: TUser = useSelector(getUser); // Получение данных пользователя

  // Состояние формы
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  // Эффект обновляет локальное состояние формы при изменении данных пользователя в сторе.
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  // Определяет, были ли внесены изменения в форму (для активации/деактивации кнопок).
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // Отправляет обновленные данные в Redux-стор.
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserData(formValue)); // Обновление данных пользователя
  };

  // Сбрасывает форму к исходным значениям(отмена измененийы)
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  // Изменение полей
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
