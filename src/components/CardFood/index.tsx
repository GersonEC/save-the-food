'use client';

import Image from 'next/image';
import { Typography } from '../Typography';
import { Progress } from '../ui/progress';
import { useEffect, useState } from 'react';
import { Food } from '@/domain/Food';
import { calculateProgress, cn, getDaysRemaining } from '@/lib/utils';
import { BadgeCategory } from '../BadgeCategory';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface CardFoodProps {
  food: Food;
  onDelete: (foodId: string) => void;
}

export const CardFood = ({ food, onDelete }: CardFoodProps) => {
  const [progress, setProgress] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const progress = calculateProgress(food);
    const timer = setTimeout(() => setProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [food.expirationDate, food]);

  useEffect(() => {
    setIsExpired(getDaysRemaining(food) === 0);
  }, [food]);

  const handleDelete = (foodId: string) => {
    if (foodId.length > 0) {
      onDelete(foodId);
    } else {
      toast.error('Errore nella rimozione del cibo');
    }
  };

  return (
    <div
      className={cn(
        'w-full flex gap-4 p-2 rounded-xl border-1 border-gray-100 shadow-sm min-w-[300px]',
        isExpired ? '' : ''
      )}
    >
      <div className='flex justify-center items-center w-1/6 min-w-[50px]'>
        <Image
          src={food.image || '/images/pineapple.jpg'}
          alt={food.name}
          width={100}
          height={100}
          className=' object-cover rounded-xl h-18'
        />
      </div>
      <div className='flex flex-col gap-2 flex-1'>
        <div className='flex justify-between items-center'>
          <Typography as='p' className='text-gray-800 truncate w-[150px]'>
            {food.name}
          </Typography>
          <div className='flex items-center gap-1'>
            <BadgeCategory category={food.category.name} />
            <Button
              variant='link'
              className='text-gray-500 hover:text-red-600'
              onClick={() => handleDelete(food.id || '')}
            >
              <Trash2 />
            </Button>
          </div>
          {/* <Typography as='p'>Food Description</Typography> */}
          {/* <p>{food.location}</p>
        <p>{food.quantity}</p> */}
        </div>

        <div className='flex justify-between items-end w-full'>
          <div className='flex flex-col gap-1'>
            <Typography as='p' className='text-xs text-gray-500'>
              Scadenza:{' '}
              {new Date(food.expirationDate).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography as='span' isMuted className='text-xs italic'>
              {getDaysRemaining(food) === 0
                ? 'Scaduto'
                : getDaysRemaining(food) === 1
                ? '1 giorno rimasto'
                : `${getDaysRemaining(food)} giorni rimasti`}
            </Typography>
          </div>
          <div className='flex flex-col w-1/4'>
            <Progress
              value={progress}
              className='w-full duration-300 transition-all opacity-80'
              bgColorProgressIndicator={
                getDaysRemaining(food) === 0
                  ? 'bg-yellow-800'
                  : getDaysRemaining(food) < 2
                  ? 'bg-yellow-600'
                  : 'bg-green-700'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
