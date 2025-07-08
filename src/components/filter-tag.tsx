import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

export function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <div className='bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm'>
      <span>{label}</span>
      <Button
        variant='ghost'
        size='sm'
        className='hover:bg-primary/20 h-4 w-4 p-0'
        onClick={onRemove}
      >
        <X className='h-3 w-3' />
      </Button>
    </div>
  );
}
