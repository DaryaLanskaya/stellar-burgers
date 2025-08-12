import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsData } from '../../slices/ingredientSlice/ingredientSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  // IngredientDetails, который отображает детальную информацию о конкретном ингредиенте

  /** TODO: взять переменную из стора */

  const location = useLocation(); // Получает текущий URL
  const ingredients = useSelector(getIngredientsData); // Получает список всех ингредиентов из Redux-стора
  const ingredientId = location.pathname.replace('/ingredients/', ''); // Из пути URL извлекается ID ингредиента

  if (!ingredients) {
    return <Preloader />;
  }

  // В массиве ингредиентов ищется элемент, чей _id совпадает с ID из URL
  const ingredientData = ingredients.find(
    (ingredient: TIngredient) => ingredient._id === ingredientId
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  // Если ингредиент найден, рендерится UI-компонент с передачей данных об ингредиенте.
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
