import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getIngredientsData } from '../../slices/ingredientSlice/ingredientSlice';
import { Preloader } from '../ui/preloader/preloader';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(getIngredientsData); // Получаем все ингредиенты из стора

  /** TODO: взять переменные из стора */
  const buns: TIngredient[] = ingredients.filter(
    (ingredient) => ingredient.type === 'bun'
  );
  const mains: TIngredient[] = ingredients.filter(
    (ingredient) => ingredient.type === 'main'
  );
  const sauces: TIngredient[] = ingredients.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun'); // Значение по умолчанию - открытый таб
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 }); // Используем для подгрузки данных

  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });

  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!ingredients.length) {
    return <Preloader />;
  } else {
    return (
      <BurgerIngredientsUI
        currentTab={currentTab}
        buns={buns}
        mains={mains}
        sauces={sauces}
        titleBunRef={titleBunRef}
        titleMainRef={titleMainRef}
        titleSaucesRef={titleSaucesRef}
        bunsRef={bunsRef}
        mainsRef={mainsRef}
        saucesRef={saucesRef}
        onTabClick={onTabClick}
      />
    );
  }
};
