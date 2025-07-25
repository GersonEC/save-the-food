import { Typography } from '@/components/Typography';
import { AddFoodForm } from './components/AddFoodForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddFood() {
  return (
    <ProtectedRoute>
      <div className='flex flex-col gap-4 max-w-4xl mx-auto p-4'>
        <Typography as='h2' className=''>
          Aggiungi un alimento
        </Typography>
        <AddFoodForm />
      </div>
    </ProtectedRoute>
  );
}
