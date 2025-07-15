import { FoodCategory } from '@/domain/Food';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface BadgeCategoryProps {
  category: FoodCategory;
}

export const BadgeCategory = ({ category }: BadgeCategoryProps) => {
  const mapCategoryClassName: Record<FoodCategory, string> = {
    Frutta: 'bg-green-600/30 text-green-700',
    Verdura: 'bg-blue-600/30 text-blue-700',
    Carne: 'bg-red-600/30 text-red-700',
    Pesce: 'bg-yellow-600/30 text-yellow-700',
    Grano: 'bg-purple-600/30 text-purple-700',
    Bevande: 'bg-orange-600/30 text-orange-700',
    Snack: 'bg-pink-600/30 text-pink-700',
    Avanzi: 'bg-gray-600/30 text-gray-700',
    Altro: 'bg-gray-600/30 text-gray-700',
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
