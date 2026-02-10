import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TConstructorIngredient } from '../../utils/types';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    const handleAdd = () => {
      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: `${ingredient._id}-${Date.now()}-${Math.random().toString(36).slice(2)}`
      };

      if (ingredient.type === 'bun') {
        dispatch(addBun(constructorIngredient));
      } else {
        dispatch(addIngredient(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        onClick={handleClick}
      />
    );
  }
);
