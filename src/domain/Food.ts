export type FoodCategory =
  | 'Frutta'
  | 'Verdura'
  | 'Carne'
  | 'Pesce'
  | 'Grano'
  | 'Bevande'
  | 'Snack'
  | 'Avanzi'
  | 'Altro';

// Array of all food categories as strings
export const FOOD_CATEGORIES: FoodCategory[] = [
  'Frutta',
  'Verdura',
  'Carne',
  'Pesce',
  'Grano',
  'Bevande',
  'Snack',
  'Avanzi',
  'Altro',
];

export interface Category {
  id: string;
  name: FoodCategory;
}

export interface Food {
  id?: string;
  name: string;
  category: Category;
  expirationDate: Date;
  quantity: number;
  location?: string;
  description?: string;
  image?: string;
}
