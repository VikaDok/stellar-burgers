import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorState = useSelector((state) => state.constructor);
  const bun = constructorState?.bun || null;
  const ingredients = constructorState?.ingredients || [];

  const { isLoading: orderRequest, currentOrder: orderModalData } = useSelector(
    (state) => state.order
  );

  const user = useSelector((state) => state.user.user);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun) {
      alert('Выберите булку!');
      return;
    }

    if (ingredients.length === 0) {
      alert('Добавьте начинку!');
      return;
    }

    if (orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ing: TConstructorIngredient) => ing._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Не удалось создать заказ:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => {
        if (!item || typeof item.price !== 'number') {
          return sum;
        }
        return sum + item.price;
      },
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
