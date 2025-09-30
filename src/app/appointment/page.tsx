
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import Appointment from '@/components/appointment';
import OutstandingServices from '@/components/outstanding-services';
import Counters from '@/components/counters';

export default function AppointmentPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Appointment" imageSrc="/images/doctors/doc7.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Appointment Page' }]} />
        
        <section className="py-12 md:py-24 lg:py-32 text-center">
            <div className="container mx-auto px-4 md:px-6">
                 <p className="text-primary font-headline uppercase">Hope History</p>
                 <h2 className="text-3xl font-bold font-headline text-foreground mt-2">EVERYTHING BEGAN IN A GARAGE</h2>
                 <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">Pellentesque semper quis neque dictum hendrerit. Sed nulla ipsum, porttitor pharetra tortor in, consequat imperdiet nisi. Phasellus et quam tristique, cursus tellus vitae, convallis neque.</p>
            </div>
        </section>

        <Appointment />
        <OutstandingServices />
        <Counters />
      </main>
      <Footer />
    </div>
  );
}
