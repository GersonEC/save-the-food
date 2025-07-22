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

export default function AccessCodeLogin() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessCode } = useAccessCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Please enter an access code');
      return;
    }

    setIsLoading(true);

    try {
      // Validate the access code by trying to fetch food items
      const response = await fetch(`/api/food?accessCode=${code}`);

      if (response.ok) {
        setAccessCode(code);
        toast.success('Access granted! Welcome to your food list.');
      } else {
        toast.error('Invalid access code. Please try again.');
      }
    } catch (error) {
      console.error('Error validating access code:', error);
      toast.error('Error validating access code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-start justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Save The Food</CardTitle>
          <CardDescription>
            Enter your access code to view your food list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='accessCode'>Access Code</Label>
              <Input
                id='accessCode'
                type='text'
                placeholder='Enter your 4-digit code'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                className='text-center text-lg tracking-widest'
                disabled={isLoading}
              />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Validating...' : 'Access Food List'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            <p>Don&apos;t have an access code?</p>
            <p>Ask your household member for the shared code.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
