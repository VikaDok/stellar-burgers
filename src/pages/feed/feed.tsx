import { FeedUI } from '@ui-pages';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-default mt-20'>
        <h1>Ошибка загрузки ленты заказов</h1>
        <p>{error}</p>
        <button onClick={handleGetFeeds}>Повторить попытку</button>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
