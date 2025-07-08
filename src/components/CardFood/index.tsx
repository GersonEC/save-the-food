'use client';

import Image from 'next/image';
import { Typography } from '../Typography';
import { Progress } from '../ui/progress';
import { useEffect, useState } from 'react';
import { Food } from '@/domain/Food';
import { calculateProgress, getDaysRemaining } from '@/lib/utils';
import { BadgeCategory } from '../BadgeCategory';

interface CardFoodProps {
  food: Food;
}

export const CardFood = ({ food }: CardFoodProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progress = calculateProgress(food);
    const timer = setTimeout(() => setProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [food.expirationDate, food]);

  return (
    <div className='border-2 border-neutral-500 w-full min-w-[300px] min-h-[200px] flex flex-col gap-2 p-4 rounded-xl shadow-xl'>
      <div className='flex justify-center items-center'>
        <Image
          src='/images/pineapple.jpg'
          alt='Pineapple'
          width={200}
          height={200}
          className=' object-cover rounded-full'
        />
      </div>
      <div>
        <Typography as='h3'>{food.name}</Typography>
        <BadgeCategory category={food.category[0]} />
        {/* <Typography as='p'>Food Description</Typography> */}
        <p>{food.location}</p>
        <p>{food.quantity}</p>
      </div>
      <div className='flex flex-col'>
        <Progress
          value={progress}
          className='w-full duration-300 transition-all'
        />
        <Typography as='span' isMuted className='font-semibold text-end'>
          {getDaysRemaining(food)}
        </Typography>
      </div>
      <div className='flex items-center gap-2 border-2 border-red-300 bg-red-100/40 p-1 rounded-md justify-center text-destructive italic font-semibold'>
        <Typography as='p'>Scadenza:</Typography>
        {new Date(food.expirationDate).toLocaleDateString('it-IT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  );
};
