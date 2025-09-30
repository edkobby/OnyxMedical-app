
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import Gallery from '@/components/gallery';
import CtaBar from '@/components/cta-bar';

export default function GalleryPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Gallery" imageSrc="/images/hero/onyx 1.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]} />
        <Gallery />
        <CtaBar />
      </main>
      <Footer />
    </div>
  );
}
