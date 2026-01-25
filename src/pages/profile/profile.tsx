import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userUpdate } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const { user, error } = useSelector((state) => state.user);
  const [updateUserError, setUpdateUserError] = useState('');

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateUserError('');

    if (!isFormChanged) return;

    try {
      const resultAction = await dispatch(
        userUpdate({
          name: formValue.name,
          email: formValue.email,
          ...(formValue.password && { password: formValue.password })
        })
      );

      if (userUpdate.fulfilled.match(resultAction)) {
        setFormValue((prev) => ({ ...prev, password: '' }));
      } else {
        setUpdateUserError('Ошибка при обновлении профиля');
      }
    } catch (error) {
      setUpdateUserError('Ошибка при обновлении профиля');
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setUpdateUserError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setUpdateUserError('');
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || error || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
