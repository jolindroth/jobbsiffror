'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Vacancy page error:', error);
  }, [error]);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col items-center justify-center space-y-4'>
        <h2 className='text-2xl font-bold tracking-tight'>
          Kunde inte ladda data
        </h2>
        <p className='text-muted-foreground'>
          Ett fel uppstod när jobbstatistiken skulle hämtas. Försök igen senare.
        </p>
        <div className='flex justify-center gap-4'>
          <Button onClick={reset}>Försök igen</Button>
          <Button variant='outline' asChild>
            <Link href='/dashboard/'>Tillbaka till översikt</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
