
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import ComingSoon from '@/components/coming-soon';

export default function ShortcodesPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Shortcodes" imageSrc="/images/hero/onyx 1.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Shortcodes' }]} />
        <ComingSoon pageName="Shortcodes" />
      </main>
      <Footer />
    </div>
  );
}
