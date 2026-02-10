import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { LoginUI } from '@ui-pages';
import { userLogin } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || { pathname: '/' };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const resultAction = await dispatch(userLogin({ email, password }));

      if (userLogin.fulfilled.match(resultAction)) {
        navigate(from, { replace: true });
      } else {
        if (resultAction.payload) {
          setErrorText(resultAction.payload as string);
        } else {
          setErrorText('Ошибка входа. Проверьте email и пароль.');
        }
      }
    } catch (error) {
      setErrorText('Ошибка входа. Попробуйте снова.');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
