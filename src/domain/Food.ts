import { Category } from '@prisma/client';

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

export interface Food {
  name: string;
  categories: Category[];
  expirationDate: Date;
  quantity: number;
  location?: string;
  description?: string;
  image?: string;
}
