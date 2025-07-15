import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Kontakt - Jobbsiffror',
  description:
    'Kontakta oss för frågor om Jobbsiffror eller svenska arbetsmarknaden',
  robots: 'noindex, nofollow'
};

export default function ContactPage() {
  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <h1 className='mb-6 text-3xl font-bold'>Kontakt</h1>

        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Om Jobbsiffror</h2>
            <p>
              Jobbsiffror är en oberoende webbplats som presenterar statistik
              och analys av svenska arbetsmarknaden. Projektet drivs av Jonathan
              Lindroth som ett sätt att göra arbetsmarknadsdata mer tillgänglig
              för allmänheten.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Kontakta oss</h2>
            <p>För frågor, förslag eller feedback kan du kontakta oss via:</p>

            <div className='bg-muted/50 mt-4 rounded-lg p-6'>
              <h3 className='mb-3 text-lg font-semibold'>Jonathan Lindroth</h3>
              <div className='space-y-2'>
                <div>
                  <span className='font-medium'>LinkedIn:</span>
                  <a
                    href='https://linkedin.com/in/jonathan-lindroth'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary ml-2 hover:underline'
                  >
                    linkedin.com/in/jonathan-lindroth
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Vanliga frågor</h2>

            <div className='space-y-4'>
              <div>
                <h4 className='mb-2 font-semibold'>Var kommer data ifrån?</h4>
                <p className='text-muted-foreground'>
                  All data kommer från Arbetsförmedlingens öppna API och andra
                  svenska myndigheters offentliga databaser. Vi samlar inte in
                  egen data.
                </p>
              </div>

              <div>
                <h4 className='mb-2 font-semibold'>
                  Hur ofta uppdateras data?
                </h4>
                <p className='text-muted-foreground'>
                  Data uppdateras kontinuerligt baserat på när
                  Arbetsförmedlingen publicerar ny information i sitt API.
                </p>
              </div>

              <div>
                <h4 className='mb-2 font-semibold'>
                  Kan jag använda data från webbplatsen?
                </h4>
                <p className='text-muted-foreground'>
                  Data som presenteras är offentlig information från svenska
                  myndigheter. För specifika användningsfall, vänligen kontakta
                  oss först.
                </p>
              </div>

              <div>
                <h4 className='mb-2 font-semibold'>
                  Har ni planer på fler funktioner?
                </h4>
                <p className='text-muted-foreground'>
                  Ja! Vi arbetar kontinuerligt med att förbättra och utöka
                  webbplatsen. Hör gärna av dig med förslag på vad du skulle
                  vilja se.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
