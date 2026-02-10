import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { currentOrder, isLoading } = useSelector((state) => state.order);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number) {
      const orderNumber = parseInt(number, 10);
      if (!isNaN(orderNumber)) {
        dispatch(getOrderByNumber(orderNumber));
      }
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div className='text text_type_main-default'>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
