import { Skeleton } from '@/components/ui/skeleton';
import PageContainer from '@/components/layout/page-container';

export default function Loading() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='mb-8'>
          <Skeleton className='mb-2 h-10 w-96' />
        </div>

        {/* Stats cards skeleton */}
        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='rounded-lg border p-6'>
              <Skeleton className='mb-2 h-4 w-32' />
              <Skeleton className='mb-1 h-8 w-20' />
              <Skeleton className='h-3 w-28' />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <Skeleton className='h-64 w-full' />
          </div>
          <div className='col-span-4 md:col-span-3'>
            <Skeleton className='h-64 w-full' />
          </div>
          <div className='col-span-4'>
            <Skeleton className='h-64 w-full' />
          </div>
          <div className='col-span-4 md:col-span-3'>
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
