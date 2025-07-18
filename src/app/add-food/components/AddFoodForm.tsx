'use client';

import { useFood } from '@/app/hooks/useFood';
import { CameraCapture } from '@/components/CameraCapture';
import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Food, FOOD_CATEGORIES, FoodCategory } from '@/domain/Food';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { toast } from 'sonner';

export function AddFoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutation } = useFood();

  const form = useForm({
    defaultValues: {
      name: '',
      category: '',
      location: '',
      expirationDate: new Date(),
      quantity: 1,
      image: '',
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const { name, category, location, expirationDate, quantity, image } =
        values.value;
      const food: Food = {
        name,
        category: {
          id: '',
          name: category as FoodCategory,
        },
        location,
        expirationDate,
        quantity,
        image,
      };
      try {
        mutation.mutate(food);
      } catch (error) {
        console.error('Error adding food:', error);
        toast.error('Si è verificato un errore di connessione');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className='space-y-4'>
        <form.Field
          name='name'
          validators={{
            onChange: ({ value }) =>
              !value ? 'Il nome è obbligatorio' : undefined,
          }}
        >
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                <Input
                  className='border-none shadow-none bg-green-500/20 rounded-md p-4'
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='es. Pane, Carne, Lenticchie...'
                />
                {field.state.meta.errorMap['onChange'] && (
                  <em className='text-red-700 text-sm'>
                    {field.state.meta.errorMap['onChange']}
                  </em>
                )}
              </div>
            );
          }}
        </form.Field>
        <form.Field
          name='category'
          validators={{
            onChange: ({ value }) =>
              !value ? 'La categoria è obbligatoria' : undefined,
          }}
        >
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                {/* <Label htmlFor={field.name}>Categoria</Label> */}
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger className='w-full border-none shadow-none bg-green-500/20 rounded-md p-4'>
                    <SelectValue placeholder='Seleziona una categoria' />
                  </SelectTrigger>
                  <SelectContent>
                    {FOOD_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errorMap['onChange'] && (
                  <em className='text-red-700 text-sm'>
                    {field.state.meta.errorMap['onChange']}
                  </em>
                )}
              </div>
            );
          }}
        </form.Field>
        <form.Field name='location'>
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                {/* <Label htmlFor={field.name}>Posizione</Label> */}
                <Input
                  className='border-none shadow-none bg-green-500/20 rounded-md p-4'
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='es. Cucina, Frigorifero, Dispensa'
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field
          name='quantity'
          validators={{
            onChange: ({ value }) =>
              !value ? 'La quantità è obbligatoria' : undefined,
          }}
        >
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                {/* <Label htmlFor={field.name}>Quantità</Label> */}
                <Input
                  className='border-none shadow-none bg-green-500/20 rounded-md p-4'
                  type='number'
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errorMap['onChange'] && (
                  <em className='text-red-700 text-sm'>
                    {field.state.meta.errorMap['onChange']}
                  </em>
                )}
              </div>
            );
          }}
        </form.Field>
        <form.Field name='expirationDate'>
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                {/* <Label htmlFor={field.name}>Scadenza</Label> */}
                <DatePicker
                  id={field.name}
                  name={field.name}
                  handleChangeDate={(e) => field.handleChange(e || new Date())}
                  placeholder='Scadenza'
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field name='image'>
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                {/* <Label htmlFor={field.name}>Foto del cibo</Label> */}
                <CameraCapture
                  onImageCapture={(imageData) => field.handleChange(imageData)}
                  onImageRemove={() => field.handleChange('')}
                  currentImage={field.state.value}
                />
              </div>
            );
          }}
        </form.Field>
        <div className='max-w-md mx-auto mt-8'>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Aggiungendo...' : 'Aggiungi'}
          </Button>
        </div>
      </div>
    </form>
  );
}
