import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { TRegisterData } from '@api';
import { registerUser } from '../../slices/authSlice/authSlice';

// Код реализует компонент регистрации пользователя в React-приложении.
export const Register: FC = () => {
  const [userName, setUserName] = useState(''); // Начальное состояние поля имени
  const [email, setEmail] = useState(''); // Начальное состоние почты
  const [password, setPassword] = useState(''); // Начальное состояние пароля
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TRegisterData = {
      email: email,
      name: userName,
      password: password
    };
    dispatch(registerUser(userData)).then(() => navigate('/profile')); // После успешной регистрации происходит переход на /profile
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
