import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Användarvillkor - Jobbsiffror',
  description:
    'Användarvillkor för Jobbsiffror - regler och villkor för användning av webbplatsen',
  robots: 'noindex, nofollow'
};

export default function TermsPage() {
  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <h1 className='mb-6 text-3xl font-bold'>Användarvillkor</h1>

        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <p className='text-muted-foreground mb-6 text-lg'>
            Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
          </p>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              1. Allmänna bestämmelser
            </h2>
            <p>
              Dessa användarvillkor (&quot;Villkoren&quot;) reglerar din
              användning av webbplatsen Jobbsiffror (jobbsiffror.se) som
              tillhandahålls av Jonathan Lindroth (&quot;vi&quot;,
              &quot;oss&quot;, eller &quot;Leverantören&quot;). Genom att
              använda webbplatsen godkänner du dessa villkor i sin helhet.
            </p>
            <div className='bg-muted/30 mt-3 rounded-lg p-4'>
              <p>
                <strong>Tjänsteleverantör:</strong>
                <br />
                Jonathan Lindroth
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
              2. Beskrivning av tjänsten
            </h2>
            <p>
              Jobbsiffror är en kostnadsfri webbaserad informationstjänst som:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Presenterar statistik och analys av svenska arbetsmarknaden
              </li>
              <li>
                Visualiserar data från svenska myndigheters öppna databaser
              </li>
              <li>
                Tillhandahåller aggregerad information om jobbtrender och
                arbetsmarknadsutveckling
              </li>
              <li>
                Baseras primärt på data från Arbetsförmedlingens
                JobTech-plattform
              </li>
            </ul>
            <p className='mt-3'>
              Tjänsten är avsedd för informationsändamål och utgör inte
              professionell rådgivning inom arbetsmarknad, rekrytering eller
              karriärplanering.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              3. Användarens rättigheter och skyldigheter
            </h2>

            <h3 className='mb-3 text-lg font-semibold'>
              3.1 Tillåten användning
            </h3>
            <p>Du har rätt att:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Använda webbplatsen för personligt, icke-kommersiellt bruk
              </li>
              <li>Visa och navigera i det tillgängliga innehållet</li>
              <li>Dela enskilda sidor via direktlänkar</li>
              <li>
                Använda informationen för forskning och utbildning (med
                källhänvisning)
              </li>
            </ul>

            <h3 className='mb-3 text-lg font-semibold'>
              3.2 Förbjuden användning
            </h3>
            <p>Du får inte:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Använda tjänsten för kommersiella ändamål utan skriftligt
                tillstånd
              </li>
              <li>
                Försöka störa, skada eller överlasta webbplatsens infrastruktur
              </li>
              <li>
                Använda automatiserade system (robotar, skrapning) för
                datainsamling
              </li>
              <li>
                Försöka få obehörig åtkomst till webbplatsens system eller
                databaser
              </li>
              <li>Återpublicera större delar av innehållet utan tillstånd</li>
              <li>
                Använda tjänsten för lagstridiga eller skadliga aktiviteter
              </li>
              <li>Kringgå tekniska begränsningar eller säkerhetsåtgärder</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              4. Immaterialrätt och äganderätt
            </h2>

            <h3 className='mb-3 text-lg font-semibold'>
              4.1 Webbplatsens innehåll
            </h3>
            <p>
              Alla immateriella rättigheter till webbplatsens design, källkod,
              layout, grafik och egenutvecklat innehåll tillhör Jonathan
              Lindroth, såvida inte annat anges.
            </p>

            <h3 className='mb-3 text-lg font-semibold'>4.2 Öppna data</h3>
            <p>
              Statistisk data och information som presenteras härrör från
              svenska myndigheters öppna databaser och omfattas av respektive
              myndighets villkor för dataanvändning. Primära datakällor
              inkluderar:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>Arbetsförmedlingens JobTech-plattform</li>
              <li>Sveriges officiella statistik (SCB)</li>
              <li>Andra myndigheters öppna data enligt PSI-lagen</li>
            </ul>

            <h3 className='mb-3 text-lg font-semibold'>
              4.3 Tredjepartskomponenter
            </h3>
            <p>
              Webbplatsen använder öppna källkodsprojekt och bibliotek som
              omfattas av respektive licenser (MIT, Apache, etc.).
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              5. Tillgänglighet och driftstörningar
            </h2>
            <p>
              Vi strävar efter att hålla tjänsten tillgänglig dygnet runt, men
              kan inte garantera 100% upptid. Tjänsten kan tillfälligt vara
              otillgänglig på grund av:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>Planerat underhåll (meddelas i förväg när möjligt)</li>
              <li>Tekniska problem eller serverfel</li>
              <li>Överlastning av externa API:er</li>
              <li>Force majeure-händelser</li>
            </ul>
            <p className='mt-3'>
              Vi förbehåller oss rätten att tillfälligt begränsa eller stänga av
              tjänsten för underhåll, säkerhetsuppdateringar eller andra
              tekniska skäl.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              6. Ansvarsfriskrivning och begränsningar
            </h2>

            <h3 className='mb-3 text-lg font-semibold'>
              6.1 Informationens tillförlitlighet
            </h3>
            <p>
              All information på webbplatsen tillhandahålls &quot;i befintligt
              skick&quot; utan garantier av något slag. Vi ansvarar inte för:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Riktigheten, fullständigheten eller aktualiteten av presenterad
                data
              </li>
              <li>Beslut som fattas baserat på informationen</li>
              <li>Fel eller fördröjningar i underliggande datakällor</li>
              <li>Avbrott i datatillgång från externa API:er</li>
            </ul>

            <h3 className='mb-3 text-lg font-semibold'>
              6.2 Ansvarsbegränsning
            </h3>
            <p>
              I den utsträckning svensk lag tillåter begränsas vårt ansvar för
              direkta eller indirekta skador till följd av tjänstens användning.
              Detta inkluderar men är inte begränsat till ekonomiska förluster,
              dataförlust eller driftstörningar.
            </p>

            <h3 className='mb-3 text-lg font-semibold'>
              6.3 Tredjepartstjänster
            </h3>
            <p>
              Webbplatsen kan innehålla länkar till externa webbplatser eller
              tjänster. Vi ansvarar inte för innehållet, säkerheten eller
              integritetspolicyn för dessa externa resurser.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              7. Dataskydd och personuppgifter
            </h2>
            <p>
              Behandling av personuppgifter regleras av vår separata
              <a href='/privacy' className='text-primary hover:underline'>
                {' '}
                integritetspolicy
              </a>
              , som utgör en integrerad del av dessa villkor. Genom att använda
              tjänsten godkänner du behandlingen av personuppgifter enligt
              integritetspolicyn.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              8. Ändringar av villkoren
            </h2>
            <p>
              Vi förbehåller oss rätten att när som helst ändra dessa villkor.
              Väsentliga ändringar kommer att meddelas på webbplatsen med minst
              30 dagars varsel. Fortsatt användning av tjänsten efter ändringar
              innebär att du accepterar de nya villkoren.
            </p>
            <p className='mt-3'>
              Det är ditt ansvar att regelbundet kontrollera eventuella
              uppdateringar av dessa villkor.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              9. Uppsägning och avslutning
            </h2>
            <p>
              Du kan när som helst upphöra att använda tjänsten. Vi förbehåller
              oss rätten att tillfälligt eller permanent avsluta tillgången till
              tjänsten för användare som bryter mot dessa villkor.
            </p>
            <p className='mt-3'>
              Vid uppsägning av tjänsten kommer dessa villkor att fortsätta
              gälla för alla eventuella kvarstående förpliktelser eller anspråk.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              10. Tillämplig lag och tvistlösning
            </h2>
            <p>
              Dessa villkor regleras av svensk rätt. Eventuella tvister ska i
              första hand lösas genom förhandling mellan parterna.
            </p>
            <p className='mt-3'>
              Om förhandling inte leder till lösning ska tvisten avgöras av
              svensk allmän domstol, med Stockholm tingsrätt som första instans
              för tvister som överstiger tingsrättens gräns för småmål.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>11. Övrigt</h2>

            <h3 className='mb-3 text-lg font-semibold'>11.1 Giltighet</h3>
            <p>
              Om någon bestämmelse i dessa villkor skulle bedömas som ogiltig
              eller ogenomförbar, påverkar detta inte giltigheten av övriga
              bestämmelser.
            </p>

            <h3 className='mb-3 text-lg font-semibold'>11.2 Språk</h3>
            <p>
              Dessa villkor är författade på svenska. Vid översättning till
              andra språk gäller den svenska versionen i händelse av
              tolkningsskillnader.
            </p>

            <h3 className='mb-3 text-lg font-semibold'>11.3 Force majeure</h3>
            <p>
              Vi ansvarar inte för dröjsmål eller utebliven prestation som beror
              på omständigheter utanför vår rimliga kontroll, inklusive men inte
              begränsat till naturkatastrofer, krig, terroristattacker,
              myndighetsbeslut, strömavbrott eller internetstörningar.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              12. Kontaktinformation
            </h2>
            <p>
              För frågor om dessa användarvillkor eller tjänsten i allmänhet,
              kontakta oss via:
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
              Vi strävar efter att besvara alla förfrågningar inom rimlig tid,
              vanligtvis inom 5-10 arbetsdagar.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
