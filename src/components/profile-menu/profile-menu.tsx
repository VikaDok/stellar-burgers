import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { ProfileMenuUI } from '@ui';
import { userLogout } from '../../services/slices/userSlice';
import { clearUserOrders } from '../../services/slices/userOrdersSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(userLogout());

      if (userLogout.fulfilled.match(resultAction)) {
        dispatch(clearUserOrders());
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
