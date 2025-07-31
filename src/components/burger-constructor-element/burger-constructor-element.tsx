import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../../slices/constructorSlice/constructorSlice';

// Создаем мемоизированный компонент для оптимизации производительности
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  // Деструктурируем пропсы компонента
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Обработчик перемещения ингредиента вниз
    const handleMoveDown = () => {
      // Диспатчим экшен перемещения вниз с ID ингредиента
      dispatch(moveIngredientDown(ingredient.id));
    };

    // Обработчик перемещения ингредиента вверх
    const handleMoveUp = () => {
      // Диспатчим экшен перемещения вверх с ID ингредиента
      dispatch(moveIngredientUp(ingredient.id));
    };

    // Обработчик удаления ингредиента
    const handleClose = () => {
      // Диспатчим экшен удаления с ID ингредиента
      dispatch(removeIngredient(ingredient.id));
    };

    // Рендерим UI-компонент и передаем ему все необходимые пропсы
    return (
      <BurgerConstructorElementUI
        ingredient={ingredient} // Данные текущего ингредиента
        index={index} // Индекс позиции в списке (начинается с 0)
        totalItems={totalItems} // Общее количество ингредиентов
        handleMoveUp={handleMoveUp} // Функция для перемещения вверх
        handleMoveDown={handleMoveDown} // Функция для перемещения вниз
        handleClose={handleClose} // Функция для удаления ингредиента
      />
    );
  }
);
