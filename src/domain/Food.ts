export type FoodCategory =
  | 'Fruits'
  | 'Vegetables'
  | 'Meat'
  | 'Fish'
  | 'Grains'
  | 'Beverages'
  | 'Snacks'
  | 'Other'
  | 'Leftovers';

export interface Food {
  name: string;
  category: FoodCategory[];
  expirationDate: Date;
  quantity: number;
  location?: string;
  description?: string;
  image?: string;
}
