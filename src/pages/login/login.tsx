import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';
import {
  loginUser,
  doLoginUserSuccess
} from '../../slices/authSlice/authSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleSubmit = (e: SyntheticEvent) => {
  //   e.preventDefault();
  // };
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        try {
          localStorage.setItem('refreshToken', data.refreshToken);
          setCookie('accessToken', data.accessToken, { expires: 20 * 60 }); // 20 минут
        } catch (err) {
          return new Error('error');
        }
      })
      .then(() => dispatch(doLoginUserSuccess(true)))
      .then(() => navigate('/'));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
