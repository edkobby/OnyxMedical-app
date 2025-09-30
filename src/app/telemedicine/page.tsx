
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import TelemedicineHero from '@/components/telemedicine-hero';
import TelemedicineSteps from '@/components/telemedicine-steps';
import TelemedicineForm from '@/components/telemedicine-form';
import CtaBar from '@/components/cta-bar';

export default function TelemedicinePage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Telemedicine" imageSrc="/images/banners/imgi_10_young-woman-using-mobile-phone_1048944-1414695-min.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Telemedicine' }]} />
        <TelemedicineHero />
        <TelemedicineSteps />
        <TelemedicineForm />
        <CtaBar />
      </main>
      <Footer />
    </div>
  );
}
