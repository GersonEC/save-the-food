import { CardFood } from '@/components/CardFood';
import { Typography } from '@/components/Typography';
import { Food } from '@/domain/Food';

const food: Food[] = [
  {
    name: 'Pineapple',
    category: ['Fruits'],
    location: 'Kitchen',
    expirationDate: new Date('2025-7-10'),
    quantity: 1,
  },
  {
    name: 'Apple',
    category: ['Fruits'],
    location: 'Kitchen',
    expirationDate: new Date('2025-7-30'),
    quantity: 1,
  },
  {
    name: 'Banana',
    category: ['Fruits'],
    location: 'Kitchen',
    expirationDate: new Date('2025-7-20'),
    quantity: 1,
  },
];

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <Typography as='h1' className='text-4xl font-bold text-center'>
          Save the Food
        </Typography>
        {food.map((foodItem) => (
          <CardFood key={foodItem.name} food={foodItem} />
        ))}
      </main>
      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'></footer>
    </div>
  );
}
