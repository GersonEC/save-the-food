'use client';

import Image from 'next/image';
import { Typography } from '../Typography';
import { Progress } from '../ui/progress';
import { useEffect, useState } from 'react';
import { Food } from '@/domain/Food';
import { calculateProgress, cn, getDaysRemaining } from '@/lib/utils';
import { BadgeCategory } from '../BadgeCategory';

interface CardFoodProps {
  food: Food;
}

export const CardFood = ({ food }: CardFoodProps) => {
  const [progress, setProgress] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const progress = calculateProgress(food);
    const timer = setTimeout(() => setProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [food.expirationDate, food]);

  useEffect(() => {
    setIsExpired(getDaysRemaining(food) === 'Scaduto');
  }, [food]);

  return (
    <div
      className={cn(
        'w-full min-w-[300px] min-h-[200px] flex flex-col gap-4 p-4 rounded-xl shadow-xl',
        isExpired ? 'bg-amber-300/30 border border-amber-700' : 'bg-amber-100'
      )}
    >
      <div className='flex justify-center items-center'>
        <Image
          src='/images/pineapple.jpg'
          alt='Pineapple'
          width={170}
          height={170}
          className=' object-cover rounded-full'
        />
      </div>
      <div>
        <Typography as='h4' className='text-gray-800'>
          {food.name}
        </Typography>
        {/* TODO: fix this as FoodCategory */}
        <BadgeCategory category={food.category} />
        {/* <Typography as='p'>Food Description</Typography> */}
        {/* <p>{food.location}</p>
        <p>{food.quantity}</p> */}
      </div>
      <div className='flex flex-col'>
        <Progress
          value={progress}
          className='w-full duration-300 transition-all'
        />
        <Typography
          as='span'
          isMuted
          className='font-semibold text-end text-sm italic'
        >
          {getDaysRemaining(food)}
        </Typography>
      </div>
      <div>
        <Typography
          as='p'
          className='text-sm text-end text-gray-500 font-semibold'
        >
          Data di scadenza:{' '}
          {new Date(food.expirationDate).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>
      </div>
    </div>
  );
};
