import Link from 'next/link';
import { ModeToggle } from '../ToggleMode';
import { Typography } from '../Typography';

export function Nav() {
  return (
    <div className='flex justify-between items-center border-b-1 border-slate-500/50 mb-2'>
      <Link href='/'>
        <Typography as='span' className='text-xl font-bold text-slate-700'>
          Save the Food
        </Typography>
      </Link>
      <div className='mb-2'>
        <ModeToggle />
      </div>
    </div>
  );
}
