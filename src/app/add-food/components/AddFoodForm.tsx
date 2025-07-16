'use client';

import { CameraCapture } from '@/components/CameraCapture';
import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FOOD_CATEGORIES } from '@/domain/Food';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function AddFoodForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      try {
        // Send the new food data to the API
        const response = await fetch('/api/food', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            category,
            location,
            expirationDate,
            quantity,
            image: image || undefined,
          }),
        });

        if (response.ok) {
          toast.success('Cibo aggiunto con successo');
          router.push('/');
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Si è verificato un errore');
          console.error('Failed to add food:', errorData);
        }
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
                <Label htmlFor={field.name}>Nome</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                <Label htmlFor={field.name}>Categoria</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger className='w-full'>
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
                <Label htmlFor={field.name}>Posizione</Label>
                <Input
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
                <Label htmlFor={field.name}>Quantità</Label>
                <Input
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
                <Label htmlFor={field.name}>Scadenza</Label>
                <DatePicker
                  id={field.name}
                  name={field.name}
                  handleChangeDate={(e) => field.handleChange(e || new Date())}
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field name='image'>
          {(field) => {
            return (
              <div className='flex flex-col gap-2'>
                <Label htmlFor={field.name}>Foto del cibo</Label>
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
