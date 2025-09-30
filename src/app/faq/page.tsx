
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import FaqSection from '@/components/faq-section';
import CtaBar from '@/components/cta-bar';

export default function FaqPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Frequently Asked Questions" imageSrc="/images/banners/patient1.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
        <FaqSection />
        <CtaBar />
      </main>
      <Footer />
    </div>
  );
}
