import { FoodCategory } from '@/domain/Food';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface BadgeCategoryProps {
  category: FoodCategory;
}

export const BadgeCategory = ({ category }: BadgeCategoryProps) => {
  const mapCategoryClassName: Record<FoodCategory, string> = {
    Frutta:
      'bg-orange-600/30 text-orange-700 dark:text-orange-300 shadow-none border-none',
    Verdura:
      'bg-green-600/30 text-green-700 dark:text-green-300 shadow-none border-none',
    Carne:
      'bg-amber-600/30 text-amber-700 dark:text-amber-300 shadow-none border-none',
    Pesce:
      'bg-blue-600/30 text-blue-700 dark:text-blue-300 shadow-none border-none',
    Grano:
      'bg-purple-600/30 text-purple-700 dark:text-purple-300 shadow-none border-none',
    Bevande:
      'bg-lime-600/30 text-lime-700 dark:text-lime-300 shadow-none border-none',
    Snack:
      'bg-pink-600/30 text-pink-700 dark:text-pink-300 shadow-none border-none',
    Avanzi:
      'bg-stone-600/30 text-stone-700 dark:text-stone-300 shadow-none border-none',
    Altro:
      'bg-gray-600/30 text-gray-700 dark:text-gray-300 shadow-none border-none',
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
