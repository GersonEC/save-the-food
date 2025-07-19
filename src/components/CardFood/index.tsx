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
    setIsExpired(getDaysRemaining(food) === 0);
  }, [food]);

  return (
    <div className={cn('w-full flex gap-4 p-2', isExpired ? '' : '')}>
      <div className='flex justify-center items-center'>
        <Image
          src='/images/pineapple.jpg'
          alt='Pineapple'
          width={80}
          height={80}
          className=' object-cover rounded-xl'
        />
      </div>
      <div className='flex flex-col gap-2 flex-1'>
        <div className='flex justify-between items-center'>
          <Typography as='p' className='text-gray-800 '>
            {food.name}
          </Typography>
          <BadgeCategory category={food.category.name} />
          {/* <Typography as='p'>Food Description</Typography> */}
          {/* <p>{food.location}</p>
        <p>{food.quantity}</p> */}
        </div>
        <div className='flex flex-col'>
          <Progress
            value={progress}
            className='w-full duration-300 transition-all'
            bgColorProgressIndicator={
              getDaysRemaining(food) === 0
                ? 'bg-yellow-800'
                : getDaysRemaining(food) < 2
                ? 'bg-yellow-600'
                : 'bg-green-700'
            }
          />
          <Typography as='span' isMuted className=' text-end text-sm italic'>
            {getDaysRemaining(food) === 0
              ? 'Scaduto'
              : getDaysRemaining(food) === 1
              ? '1 giorno rimasto'
              : `${getDaysRemaining(food)} giorni rimasti`}
          </Typography>
        </div>
        <div>
          <Typography as='p' className='text-xs text-end text-gray-500'>
            Data di scadenza:{' '}
            {new Date(food.expirationDate).toLocaleDateString('it-IT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </div>
      </div>
    </div>
  );
};
