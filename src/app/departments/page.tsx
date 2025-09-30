
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import Departments from '@/components/departments';
import Doctors from '@/components/doctors';
import Counters from '@/components/counters';

export default function DepartmentsPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Our Departments" imageSrc="/images/hero/nurse-wearing-scrubs-while-working-clinic_23-2149844653-min.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Departments' }]} />
        <Departments />
        <Doctors />
        <Counters />
      </main>
      <Footer />
    </div>
  );
}
