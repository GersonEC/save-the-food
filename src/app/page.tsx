import { CardFood } from '@/components/CardFood';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Food } from '@/domain/Food';
import Link from 'next/link';

// Type for food data as it comes from JSON (with string dates)
type FoodFromJSON = Omit<Food, 'expirationDate'> & {
  expirationDate: string;
};

async function getFoodData(): Promise<Food[]> {
  try {
    // In a real app, you'd use an absolute URL, but for development we can use relative
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL
        : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/food`, {
      cache: 'no-store', // Disable caching to always get fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch food data');
    }

    const data = await response.json();

    // Convert string dates back to Date objects
    return data.map((item: FoodFromJSON) => ({
      ...item,
      expirationDate: new Date(item.expirationDate),
    }));
  } catch (error) {
    console.error('Error fetching food data:', error);
    return [];
  }
}

export default async function Home() {
  const food = await getFoodData();

  return (
    <div className=''>
      <main>
        <Typography as='h1' className='text-4xl font-bold text-center'>
          Save the Food
        </Typography>
        <div className='mt-10'>
          <Link href='/add-food' className='flex justify-end'>
            <Button>Add Food</Button>
          </Link>
          <ul className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-4'>
            {food.map((foodItem) => (
              <li key={foodItem.name}>
                <CardFood food={foodItem} />
              </li>
            ))}
          </ul>
          {food.length === 0 && (
            <div className='text-center mt-8 text-gray-500'>
              <Typography as='p'>
                No food items found. Add your first food item!
              </Typography>
            </div>
          )}
        </div>
      </main>
      <Toaster />
      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'></footer>
    </div>
  );
}
