import { FoodCategory } from '@/domain/Food';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface BadgeCategoryProps {
  category: FoodCategory;
}

export const BadgeCategory = ({ category }: BadgeCategoryProps) => {
  const mapCategoryClassName = {
    Fruits: 'bg-green-600',
    Vegetables: 'bg-blue-600',
    Meat: 'bg-red-600',
    Fish: 'bg-yellow-600',
    Grains: 'bg-purple-600',
    Beverages: 'bg-orange-600',
    Snacks: 'bg-pink-600',
    Other: 'bg-gray-600',
    Leftovers: 'bg-gray-600',
  };

  return (
    <Badge
      className={cn(
        mapCategoryClassName[category],
        'text-sm font-semibold px-4 py-[2px] rounded-xl shadow-sm'
      )}
    >
      {category}
    </Badge>
  );
};
