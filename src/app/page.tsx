'use client';

import { useState } from 'react';
import { CardFood } from '@/components/CardFood';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCategory } from './hooks/useCategory';
import { useFood } from './hooks/useFood';
import { Category } from '@prisma/client';
import { Plus } from 'lucide-react';
import { DialogAddCategory } from '@/components/DialogAddCategory';
import { toast } from 'sonner';
// import { BadgeCategory } from '@/components/BadgeCategory';
// import { FoodCategory } from '@/domain/Food';
import { Input } from '@/components/ui/input';
import { CardFoodSkeleton } from '@/components/CardFoodSkeleton';
import ProtectedRoute from '@/components/ProtectedRoute';

export type LoadingStatus = 'idle' | 'pending' | 'completed';

export default function Home() {
  const { query } = useFood();
  const { query: categoryQuery, mutation } = useCategory();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  if (query.error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Typography as='p' className='text-red-500'>
          {query.error.message}
        </Typography>
      </div>
    );
  }

  const handleAddCategory = (categoryName: string) => {
    const alreadyExists = categoryQuery.data.find(
      (category: Category) =>
        category.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (alreadyExists) {
      toast.error('Categoria già esistente');
    } else {
      mutation.mutate(categoryName);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/food`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Errore nella rimozione del cibo');
      }
      toast.success('Cibo rimosso con successo');
      query.refetch();
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Errore nella rimozione del cibo');
    }
  };

  const foodSortedByExpirationDate = query.data?.sort((a, b) => {
    return (
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
    );
  });

  const filteredFood = foodSortedByExpirationDate?.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <main className='p-4 h-[85%]'>
        <div className='flex flex-col gap-4'>
          <Button className='self-end'>
            <Link href='/add-food'>
              <Plus />
            </Link>
          </Button>
          <Input
            className='border-none shadow-none bg-green-500/20 rounded-xl p-4'
            type='text'
            placeholder='Cerca un alimento'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className='flex items-center justify-center gap-4 flex-wrap'>
            {/* {categoryQuery.data.map((category: Category) => (
              <BadgeCategory
                key={category.id}
                category={category.name as FoodCategory}
              />
            ))} */}
            {/* <Button
              variant='outline'
              onClick={() => setIsCategoryDialogOpen(true)}
            >
              <Plus />
            </Button> */}
          </ul>
          <ul className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-4'>
            {query.isFetching ? (
              <CardFoodSkeleton />
            ) : (
              filteredFood?.map((foodItem) => (
                <li key={foodItem.name}>
                  <CardFood food={foodItem} onDelete={handleDelete} />
                </li>
              ))
            )}
          </ul>
          {query.data && query.data.length === 0 && (
            <div className='text-center mt-8 text-gray-500'>
              <Typography as='p'>
                Non ci sono alimenti da mostrare. Aggiungi il tuo primo
                alimento!
              </Typography>
            </div>
          )}
        </div>
      </main>
      <DialogAddCategory
        isCategoryDialogOpen={isCategoryDialogOpen}
        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
        handleAddCategory={handleAddCategory}
      />
      <footer className=' p-4 fixed bottom-0 w-full'>
        <Typography as='p' className='text-center text-sm text-gray-500'>
          <span className='font-bold'>Save the Food</span> è un progetto
          sviluppato da{' '}
          <a href='https://www.linkedin.com/in/gerson-enriquez/'>
            <u>Gerson Enriquez</u>
          </a>
        </Typography>
      </footer>
    </ProtectedRoute>
  );
}
