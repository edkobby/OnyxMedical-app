
import Header from '@/components/header';
import Hero from '@/components/hero';
import FeatureCards from '@/components/feature-cards';
import OutstandingServices from '@/components/outstanding-services';
import WhyChooseUs from '@/components/why-choose-us';
import Departments from '@/components/departments';
import Doctors from '@/components/doctors';
import Appointment from '@/components/appointment';
import Counters from '@/components/counters';
import Showcase from '@/components/showcase';
import Testimonials from '@/components/testimonials';
import CtaBar from '@/components/cta-bar';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';

export default function Home() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <OutstandingServices />
        <WhyChooseUs />
        <Departments />
        <Doctors />
        <Appointment />
        <Counters />
        <Showcase />
        <Testimonials />
        <CtaBar />
      </main>
      <Footer />
    </div>
  );
}
