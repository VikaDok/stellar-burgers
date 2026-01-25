import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { Preloader } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, isLoading, error } = useSelector((state) => state.userOrders);
  const { user, isAuthChecked } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthChecked) {
      if (user) {
        dispatch(fetchUserOrders());
      } else {
        navigate('/login');
      }
    }
  }, [dispatch, user, isAuthChecked, navigate]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-default mt-20'>
        Ошибка загрузки заказов: {error}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className='text text_type_main-default mt-20'>
        У вас пока нет заказов
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
