import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 className='text text_type_main-large mb-4'>Ингредиент не найден</h2>
        <p className='text text_type_main-medium'>ID: {id}</p>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
