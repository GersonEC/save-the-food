import { FoodCategory } from '@/domain/Food';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface BadgeCategoryProps {
  category: FoodCategory;
}

export const BadgeCategory = ({ category }: BadgeCategoryProps) => {
  const mapCategoryClassName = {
    Fruits: 'bg-green-600/30 text-green-700',
    Vegetables: 'bg-blue-600/30 text-blue-700',
    Meat: 'bg-red-600/30 text-red-700',
    Fish: 'bg-yellow-600/30 text-yellow-700',
    Grains: 'bg-purple-600/30 text-purple-700',
    Beverages: 'bg-orange-600/30 text-orange-700',
    Snacks: 'bg-pink-600/30 text-pink-700',
    Other: 'bg-gray-600/30 text-gray-700',
    Leftovers: 'bg-gray-600/30 text-gray-700',
  };

  return (
    <Badge
      className={cn(
        mapCategoryClassName[category],
        'text-xs font-semibold px-3 py-[1px] rounded-xl shadow-sm'
      )}
    >
      {category}
    </Badge>
  );
};
