import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='text-muted-foreground flex items-center gap-4 text-sm'>
            <span>© {currentYear} Jobbsiffror</span>
            <span>•</span>
            <Link
              href='/privacy'
              className='hover:text-foreground transition-colors'
            >
              Integritetspolicy
            </Link>
            <span>•</span>
            <Link
              href='/terms'
              className='hover:text-foreground transition-colors'
            >
              Användarvillkor
            </Link>
            <span>•</span>
            <Link
              href='/contact'
              className='hover:text-foreground transition-colors'
            >
              Kontakt
            </Link>
          </div>
          <div className='text-muted-foreground text-xs'>
            Data från{' '}
            <a
              href='https://jobtechdev.se/'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-foreground underline transition-colors'
            >
              Arbetsförmedlingens öppna API
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
