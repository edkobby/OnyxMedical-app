
"use client"
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import Doctors from '@/components/doctors';
import CtaBar from '@/components/cta-bar';
import AboutContent from '@/components/about-content';

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="About Us" imageSrc="/images/hero/mama&baby.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
        
        <AboutContent />
        <Doctors />
        <CtaBar />
      </main>
      <Footer />
    </div>
  );
}
