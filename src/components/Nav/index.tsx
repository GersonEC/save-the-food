'use client';

import Link from 'next/link';
import { ToggleMode } from '../ToggleMode';
import { Typography } from '../Typography';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAccessCode } from '@/app/providers/AccessCodeProvider';
import { toast } from 'sonner';

export function Nav() {
  const { clearAccessCode, isAuthenticated } = useAccessCode();

  const handleLogout = () => {
    clearAccessCode();
    toast.success('Logged out successfully');
  };

  return (
    <div className='flex justify-between items-center py-2 px-4 border-b border-gray-100'>
      <Link href='/'>
        <Typography
          as='span'
          className='text-xl font-bold text-green-700 dark:text-green-300 font-mono'
        >
          Save the Food
        </Typography>
      </Link>
      <div className='flex items-center gap-2'>
        {isAuthenticated && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleLogout}
            className='flex items-center gap-2'
          >
            <LogOut className='h-4 w-4' />
            Logout
          </Button>
        )}
        <ToggleMode />
      </div>
    </div>
  );
}
