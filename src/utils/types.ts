// Тип для отдельного элемента
export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

// Тип для конструктора ингредиентов
export type TConstructorIngredient = TIngredient & { id: string };

// Тип для отдельного заказа
export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

// Тип для всех заказов
export type TOrdersData = {
  orders: TOrder[]; // массив заказов
  total: number; // всего заказов
  totalToday: number; // заказов за сегодня
};

export type TUser = { email: string; name: string };

export type TTabMode = 'bun' | 'sauce' | 'main';
