import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Integritetspolicy - Jobbsiffror',
  description:
    'Integritetspolicy för Jobbsiffror - information om hur vi hanterar personuppgifter',
  robots: 'noindex, nofollow'
};

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <h1 className='mb-6 text-3xl font-bold'>Integritetspolicy</h1>

        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <p className='text-muted-foreground mb-6 text-lg'>
            Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
          </p>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              1. Personuppgiftsansvarig
            </h2>
            <p>
              Personuppgiftsansvarig för behandlingen av personuppgifter på
              denna webbplats är:
            </p>
            <div className='bg-muted/30 mt-3 rounded-lg p-4'>
              <p>
                <strong>Jonathan Lindroth</strong>
                <br />
                Privatperson (enskild näringsidkare i blivande)
                <br />
                Kontakt:{' '}
                <a
                  href='https://linkedin.com/in/jonathan-lindroth'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              2. Om denna webbplats
            </h2>
            <p>
              Jobbsiffror (jobbsiffror.se) är en informationswebbplats som
              presenterar statistik och analys av svenska arbetsmarknaden.
              Webbplatsen baseras på öppna data från svenska myndigheter, främst
              Arbetsförmedlingens JobTech-plattform. Tjänsten tillhandahålls
              kostnadsfritt för allmänheten.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              3. Rättslig grund för behandling
            </h2>
            <p>
              Behandling av personuppgifter sker enligt artikel 6.1 i EU:s
              allmänna dataskyddsförordning (GDPR) och svensk dataskyddslag (SFS
              2018:218) på följande rättsliga grunder:
            </p>
            <ul className='mt-3 list-disc pl-6'>
              <li>
                <strong>Berättigat intresse</strong> - För webbanalys och
                teknisk drift
              </li>
              <li>
                <strong>Samtycke</strong> - För valfria funktioner som kräver
                användarens godkännande
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              4. Personuppgifter som behandlas
            </h2>
            <h3 className='mb-3 text-lg font-semibold'>
              4.1 Teknisk information
            </h3>
            <p>
              Vid besök på webbplatsen behandlas automatiskt vissa tekniska
              uppgifter:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>Webbläsartyp och version</li>
              <li>Operativsystem</li>
              <li>Skärmupplösning</li>
              <li>Referrer-URL (vilken sida du kom ifrån)</li>
              <li>Tidpunkt för besök</li>
              <li>Sidor som besöks på webbplatsen</li>
            </ul>
            All insamlad data lagras i Vercels datacenter i USA och
            anonymiseras.
            <h3 className='mb-3 text-lg font-semibold'>
              4.2 Cookies och liknande tekniker
            </h3>
            <p>Webbplatsen använder inte cookies.</p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              5. Ändamål med behandlingen
            </h2>
            <p>Personuppgifter behandlas för följande ändamål:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>Tillhandahålla och utveckla webbplatsens funktionalitet</li>
              <li>Förbättra användarupplevelsen</li>
              <li>Analysera användningsmönster (anonymiserat)</li>
              <li>Säkerställa teknisk säkerhet och stabilitet</li>
              <li>Följa gällande lagstiftning</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              6. Mottagare av personuppgifter
            </h2>
            <p>
              Personuppgifter samlas in endast av nödvändiga
              tjänsteleverantörer:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                <strong>Vercel Inc.</strong> - Hosting och webbanalys (USA,
                adekvat skyddsnivå)
              </li>
            </ul>
            <p className='mt-3'>
              Alla tjänsteleverantörer är bundna av databehandlingsavtal och
              GDPR-krav. Inga personuppgifter säljs eller delas med tredje part
              för marknadsföringsändamål.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>7. Lagringsperiod</h2>
            <p>Personuppgifter lagras enligt följande:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                <strong>Webbanalysdata</strong> - Aggregerat i 24 månader
              </li>
              <li>
                <strong>Tekniska loggar</strong> - 30 dagar för säkerhetsändamål
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              8. Dina rättigheter enligt GDPR
            </h2>
            <p>
              Som registrerad har du följande rättigheter enligt
              dataskyddsförordningen:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                <strong>Rätt till information</strong> - Om hur dina
                personuppgifter behandlas
              </li>
              <li>
                <strong>Rätt till tillgång</strong> - Begära kopia av dina
                personuppgifter
              </li>
              <li>
                <strong>Rätt till rättelse</strong> - Begära rättelse av
                felaktiga uppgifter
              </li>
              <li>
                <strong>Rätt till radering</strong> - Begära att uppgifter
                raderas (&quot;rätten att bli glömd&quot;)
              </li>
              <li>
                <strong>Rätt till begränsning</strong> - Begära begränsad
                behandling
              </li>
              <li>
                <strong>Rätt till dataportabilitet</strong> - Få ut dina
                uppgifter i strukturerat format
              </li>
              <li>
                <strong>Rätt att invända</strong> - Mot behandling som sker med
                stöd av berättigat intresse
              </li>
              <li>
                <strong>Rätt att återkalla samtycke</strong> - När behandling
                sker med stöd av samtycke
              </li>
            </ul>
            <p className='mt-3'>
              Eftersom vi inte samlar in några identifierbara personuppgifter så
              har du inte några rättigheter att utöva gentemot oss.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>9. Säkerhet</h2>
            <p>
              Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder
              för att skydda dina personuppgifter mot obehörig åtkomst, förlust
              eller förstörelse. Detta inkluderar:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>HTTPS-kryptering för all datatrafik</li>
              <li>Regelbundna säkerhetsuppdateringar</li>
              <li>Säker hosting hos certifierade leverantörer</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              10. Överföring till tredje land
            </h2>
            <p>
              Vissa personuppgifter kan överföras till och behandlas i länder
              utanför EU/EES genom vår hosting-leverantör Vercel (USA). Denna
              överföring sker på basis av EU-kommissionens beslut om adekvat
              skyddsnivå eller med stöd av lämpliga skyddsåtgärder enligt GDPR.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>11. Klagomål</h2>
            <p>
              Om du anser att behandlingen av dina personuppgifter strider mot
              dataskyddsförordningen har du rätt att lämna klagomål till
              tillsynsmyndigheten:
            </p>
            <div className='bg-muted/30 mt-3 rounded-lg p-4'>
              <p>
                <strong>Integritetsskyddsmyndigheten (IMY)</strong>
                <br />
                Box 8114, 104 20 Stockholm
                <br />
                Telefon: 08-657 61 00
                <br />
                E-post: imy@imy.se
                <br />
                Webbplats:{' '}
                <a
                  href='https://www.imy.se'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  www.imy.se
                </a>
              </p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              12. Kontakt och utövande av rättigheter
            </h2>
            <p>
              För frågor om denna integritetspolicy eller för att utöva dina
              rättigheter enligt GDPR, kontakta oss via:
            </p>
            <div className='bg-muted/30 mt-3 rounded-lg p-4'>
              <p>
                <strong>Jonathan Lindroth</strong>
                <br />
                LinkedIn:{' '}
                <a
                  href='https://linkedin.com/in/jonathan-lindroth'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  linkedin.com/in/jonathan-lindroth
                </a>
              </p>
            </div>
            <p className='mt-3'>
              Vi strävar efter att besvara alla förfrågningar inom 30 dagar från
              det att vi mottagit din begäran.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              13. Ändringar av integritetspolicyn
            </h2>
            <p>
              Denna integritetspolicy kan komma att uppdateras. Väsentliga
              ändringar kommer att meddelas på webbplatsen. Vi rekommenderar att
              du regelbundet läser igenom denna policy för att hålla dig
              informerad om hur vi behandlar dina personuppgifter.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
