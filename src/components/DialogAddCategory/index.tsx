import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';

interface Props {
  isCategoryDialogOpen: boolean;
  setIsCategoryDialogOpen: (isOpen: boolean) => void;
  handleAddCategory: (value: string) => void;
}

export const DialogAddCategory = ({
  isCategoryDialogOpen,
  setIsCategoryDialogOpen,
  handleAddCategory,
}: Props) => {
  const [categoryName, setCategoryName] = useState('');

  const handleCancel = () => {
    setIsCategoryDialogOpen(false);
    setCategoryName('');
  };

  const handleSubmit = () => {
    handleAddCategory(categoryName);
    setCategoryName('');
    setIsCategoryDialogOpen(false);
  };

  return (
    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Aggiungi una categoria</DialogTitle>
          <DialogDescription>
            Aggiungi una categoria per organizzare i tuoi alimenti.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='category-name'>Nome</Label>
            <Input
              id='category-name'
              name='category-name'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' onClick={handleCancel}>
              Annulla
            </Button>
          </DialogClose>
          <Button
            type='submit'
            onClick={handleSubmit}
            disabled={categoryName.length === 0}
          >
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
