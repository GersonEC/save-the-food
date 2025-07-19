import Link from 'next/link';
import { ToggleMode } from '../ToggleMode';
import { Typography } from '../Typography';

export function Nav() {
  return (
    <div className='flex justify-between items-center py-2 px-4'>
      <Link href='/'>
        <Typography
          as='span'
          className='text-xl font-bold text-green-700 dark:text-green-300 font-mono'
        >
          Save the Food
        </Typography>
      </Link>
      <div className='mb-2'>
        <ToggleMode />
      </div>
    </div>
  );
}
