'use client';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

interface Props {
  id: string;
  name: string;
  handleChangeDate: (date: Date | undefined) => void;
  required?: boolean;
}

export function DatePicker({ name, id, handleChangeDate, required }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const formattedStringDate = date ? format(date, 'dd-MM-yyyy') : '';

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
    handleChangeDate(selectedDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='w-full' id={id} asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon />
          {/* {date ? format(date, 'PPP') : <span>Pick a date</span>} */}
          {formattedStringDate}
          <input type='hidden' name={name} value={formattedStringDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}
