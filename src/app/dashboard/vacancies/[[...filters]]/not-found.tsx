import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

export default function NotFound() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col items-center justify-center space-y-4'>
        <h2 className='text-2xl font-bold tracking-tight'>
          Sida hittades inte
        </h2>
        <p className='text-muted-foreground'>
          Den region eller yrkesgrupp du söker efter finns inte i vårt system.
        </p>
        <Button asChild>
          <Link href='/dashboard/'>Tillbaka till översikt</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
