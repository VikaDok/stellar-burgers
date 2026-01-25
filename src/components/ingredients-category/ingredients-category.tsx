import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector((state) => state.constructor);
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    if (!burgerConstructor) {
      return counters;
    }

    const { bun, ingredients: constructorIngredients } = burgerConstructor;

    if (constructorIngredients && Array.isArray(constructorIngredients)) {
      constructorIngredients.forEach((ingredient: TConstructorIngredient) => {
        if (ingredient && ingredient._id) {
          if (!counters[ingredient._id]) {
            counters[ingredient._id] = 0;
          }
          counters[ingredient._id]++;
        }
      });
    }

    if (bun && bun._id) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
