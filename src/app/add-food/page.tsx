import { Typography } from '@/components/Typography';
import { AddFoodForm } from './components/AddFoodForm';

export default function AddFood() {
  return (
    <div className='flex flex-col gap-4 max-w-4xl mx-auto'>
      <Typography as='h2' className=''>
        Aggiungi un alimento
      </Typography>
      <AddFoodForm />
    </div>
  );
}
