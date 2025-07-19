import { Food } from '@/domain/Food';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the progress of a food item based on the expiration date
 * @param food - The food item to calculate the progress for
 * @returns The progress percentage
 */
export const calculateProgress = (food: Food): number => {
  const today = new Date();
  const expirationDate = new Date(food.expirationDate);

  // Calculate total shelf life (assuming 7 days as default, you can adjust this)
  const totalShelfLife = 7; // days

  // Calculate days remaining until expiration
  const timeDiff = expirationDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Calculate progress percentage
  let progressPercentage;

  if (daysRemaining <= 0) {
    // Food has expired
    progressPercentage = 100;
  } else if (daysRemaining >= totalShelfLife) {
    // Food is fresh (more than total shelf life days)
    progressPercentage = 0;
  } else {
    // Calculate progress based on remaining days
    progressPercentage =
      ((totalShelfLife - daysRemaining) / totalShelfLife) * 100;
  }

  return Math.max(0, Math.min(100, progressPercentage));
};

// Calculate days remaining for display
export const getDaysRemaining = (food: Food): number => {
  const today = new Date();
  const expirationDate = new Date(food.expirationDate);
  const timeDiff = expirationDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysRemaining <= 0) {
    return 0;
  } else if (daysRemaining === 1) {
    return 1;
  } else {
    return daysRemaining;
  }
};
