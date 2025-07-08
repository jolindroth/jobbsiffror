import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';

interface RecentJobPosting {
  company: string;
  title: string;
  location: string;
  postedDate: string;
  logo?: string;
  salary?: string;
}

interface RecentSalesProps {
  data?: RecentJobPosting[];
  title?: string;
  description?: string;
}

// Mock data for demonstration
const defaultJobData: RecentJobPosting[] = [
  {
    company: 'Spotify',
    title: 'Senior Mjukvaruutvecklare',
    location: 'Stockholm',
    postedDate: '2024-01-15',
    salary: '65 000 kr/mån'
  },
  {
    company: 'Klarna',
    title: 'Fullstack Developer',
    location: 'Stockholm',
    postedDate: '2024-01-14',
    salary: '60 000 kr/mån'
  },
  {
    company: 'Volvo Cars',
    title: 'Systemarkitekt',
    location: 'Göteborg',
    postedDate: '2024-01-13',
    salary: '70 000 kr/mån'
  },
  {
    company: 'H&M',
    title: 'Frontend Developer',
    location: 'Stockholm',
    postedDate: '2024-01-12',
    salary: '55 000 kr/mån'
  },
  {
    company: 'Ericsson',
    title: 'Cloud Engineer',
    location: 'Stockholm',
    postedDate: '2024-01-11',
    salary: '68 000 kr/mån'
  }
];

export function RecentSales({
  data = defaultJobData,
  title = 'Senaste Jobbannonser',
  description = 'Nyligen publicerade lediga tjänster'
}: RecentSalesProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {data.map((job, index) => (
            <div key={index} className='flex items-start space-x-4'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={job.logo} alt={`${job.company} logo`} />
                <AvatarFallback className='text-xs'>
                  {job.company.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-2'>
                <div>
                  <p className='text-sm leading-none font-medium'>
                    {job.title}
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {job.company}
                  </p>
                </div>
                <div className='text-muted-foreground flex items-center gap-3 text-xs'>
                  <div className='flex items-center gap-1'>
                    <MapPin className='h-3 w-3' />
                    {job.location}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    {new Date(job.postedDate).toLocaleDateString('sv-SE')}
                  </div>
                </div>
                {job.salary && (
                  <Badge variant='secondary' className='text-xs'>
                    {job.salary}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
