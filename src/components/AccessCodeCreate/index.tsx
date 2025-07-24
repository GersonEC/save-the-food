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
import Link from 'next/link';

export const AccessCodeCreate = () => {
  const [loading, setLoading] = useState<LoadingStatus>('idle');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { setAccessCode } = useAccessCode();

  const form = useForm({
    defaultValues: {
      familyName: '',
    },
    onSubmit: async (values) => {
      const { familyName } = values.value;
      if (!familyName.trim()) {
        toast.error('Inserisci il nome della famiglia');
        return;
      }

      setLoading('pending');

      try {
        const response = await fetch('/api/access-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ familyName: familyName.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          setGeneratedCode(data.accessCode);
          toast.success('Codice di accesso creato con successo!');
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.error || 'Errore nella creazione del codice di accesso'
          );
        }
      } catch (error) {
        console.error('Error creating access code:', error);
        toast.error('Errore nella creazione del codice di accesso. Riprova.');
      } finally {
        setLoading('completed');
      }
    },
  });

  const handleUseCode = () => {
    if (generatedCode) {
      setAccessCode(generatedCode);
      toast.success('Accesso effettuato, benvenuto nella tua lista!');
      setTimeout(() => {
        redirect('/');
      }, 1000);
    }
  };

  return (
    <div className='flex items-start justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Save The Food</CardTitle>
          <CardDescription>
            Crea un nuovo codice di accesso per la tua famiglia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!generatedCode ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className='space-y-4'
            >
              <form.Field name='familyName'>
                {(field) => (
                  <div className='space-y-2'>
                    <Label htmlFor='familyName'>Nome della famiglia</Label>
                    <Input
                      id='familyName'
                      type='text'
                      placeholder='Es. Rossi'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className='text-center text-lg'
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
                {loading === 'pending'
                  ? 'Creazione...'
                  : 'Crea codice di accesso'}
              </Button>
            </form>
          ) : (
            <div className='space-y-4'>
              <div className='text-center space-y-2'>
                <Label className='text-sm text-muted-foreground'>
                  Il tuo codice di accesso è:
                </Label>
                <div className='text-3xl font-bold tracking-widest text-center p-4 bg-muted rounded-lg'>
                  {generatedCode}
                </div>
                <p className='text-sm text-muted-foreground'>
                  Salva questo codice in un posto sicuro. Lo userai per accedere
                  alla tua lista.
                </p>
              </div>
              <Button onClick={handleUseCode} className='w-full'>
                Usa questo codice
              </Button>
            </div>
          )}

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            <p>Hai già un codice di accesso?</p>
            <p className='inline'>
              <Link
                className='underline font-semibold hover:opacity-80 transition duration-300'
                href='/login'
              >
                Accedi qui
              </Link>{' '}
              con il tuo codice esistente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
