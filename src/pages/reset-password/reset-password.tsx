import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    setIsLoading(true);

    try {
      const response = await resetPasswordApi({ password, token });

      if (response.success) {
        localStorage.removeItem('resetPassword');
        navigate('/login', { replace: true });
      } else {
        setErrorText('Ошибка при сбросе пароля');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message || 'Ошибка при сбросе пароля');
      } else {
        setErrorText('Ошибка при сбросе пароля');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const resetPasswordFlag = localStorage.getItem('resetPassword');
    if (!resetPasswordFlag) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={errorText}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
