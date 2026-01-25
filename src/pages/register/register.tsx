import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { RegisterUI } from '@ui-pages';
import { userRegister } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const resultAction = await dispatch(
        userRegister({
          email,
          name: userName,
          password
        })
      );

      if (userRegister.fulfilled.match(resultAction)) {
        navigate('/', { replace: true });
      } else {
        if (resultAction.payload) {
          setErrorText(resultAction.payload as string);
        } else {
          setErrorText('Ошибка регистрации. Попробуйте снова.');
        }
      }
    } catch (error) {
      setErrorText('Ошибка регистрации. Попробуйте снова.');
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
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
