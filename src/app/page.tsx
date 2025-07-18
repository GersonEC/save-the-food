'use client';

import { CardFood } from '@/components/CardFood';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFood } from './hooks/useFood';

export default function Home() {
  const { query } = useFood();

  if (query.status === 'pending') {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Typography as='p'>Caricamento...</Typography>
      </div>
    );
  }

  if (query.error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Typography as='p' className='text-red-500'>
          {query.error.message}
        </Typography>
      </div>
    );
  }

  return (
    <div className=''>
      <main>
        <div className='mt-10'>
          <Link href='/add-food' className='flex justify-end'>
            <Button>Aggiungi un alimento</Button>
          </Link>
          <ul className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-4'>
            {query.data.map((foodItem) => (
              <li key={foodItem.name}>
                <CardFood food={foodItem} />
              </li>
            ))}
          </ul>
          {query.data.length === 0 && (
            <div className='text-center mt-8 text-gray-500'>
              <Typography as='p'>
                Non ci sono alimenti da mostrare. Aggiungi il tuo primo
                alimento!
              </Typography>
            </div>
          )}
        </div>
      </main>

      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'></footer>
    </div>
  );
}
