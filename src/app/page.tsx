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

export default function Home() {
  const { query } = useFood();
  const { query: categoryQuery, mutation } = useCategory();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

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

  return (
    <div className=''>
      <main>
        <div className='mt-10'>
          <Link href='/add-food' className='flex justify-end'>
            <Button>Aggiungi un alimento</Button>
          </Link>
          <ul className='flex gap-4'>
            {categoryQuery.data.map((category: Category) => (
              <li key={category.id}>{category.name}</li>
            ))}
            <Button
              variant='outline'
              onClick={() => setIsCategoryDialogOpen(true)}
            >
              <Plus />
            </Button>
          </ul>
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
      <DialogAddCategory
        isCategoryDialogOpen={isCategoryDialogOpen}
        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
        handleAddCategory={handleAddCategory}
      />
      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'></footer>
    </div>
  );
}
