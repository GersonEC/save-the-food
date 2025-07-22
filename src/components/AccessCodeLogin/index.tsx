'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessCode } from '@/app/providers/AccessCodeProvider';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useForm } from '@tanstack/react-form';
import { LoadingStatus } from '@/app/page';
import { redirect } from 'next/navigation';

export default function AccessCodeLogin() {
  const [loading, setLoading] = useState<LoadingStatus>('idle');
  const { setAccessCode } = useAccessCode();

  const form = useForm({
    defaultValues: {
      code: '',
    },
    onSubmit: async (values) => {
      const { code } = values.value;
      if (!code.trim()) {
        toast.error('Inserisci un codice di accesso');
        return;
      }

      setLoading('pending');

      try {
        // Validate the access code by trying to fetch food items
        const response = await fetch(`/api/food?accessCode=${code}`);

        if (response.ok) {
          setAccessCode(code);
          toast.success('Accesso effettuato, benvenuto nella tua lista!');
          setTimeout(() => {
            redirect('/');
          }, 1000);
        } else {
          toast.error('Codice di accesso non valido. Riprova.');
        }
      } catch (error) {
        console.error('Error validating access code:', error);
        toast.error('Errore nella validazione del codice di accesso. Riprova.');
      } finally {
        setLoading('completed');
      }
    },
  });

  return (
    <div className='flex items-start justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Save The Food</CardTitle>
          <CardDescription>
            Inserisci il tuo codice di accesso per visualizzare la tua lista
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className='space-y-4'
          >
            <form.Field name='code'>
              {(field) => (
                <div className='space-y-2'>
                  <Label htmlFor='accessCode'>
                    Inserisci il tuo codice di accesso
                  </Label>
                  <Input
                    id='accessCode'
                    type='text'
                    placeholder='1234'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    maxLength={4}
                    className='text-center text-lg tracking-widest'
                    disabled={loading === 'pending'}
                  />
                </div>
              )}
            </form.Field>
            <Button
              type='submit'
              className='w-full'
              disabled={loading === 'pending'}
            >
              {loading === 'pending' ? 'Validazione...' : 'Accedi alla lista'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            <p>Non hai un codice di accesso?</p>
            <p>Chiedi al tuo membro della famiglia per il codice condiviso.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
