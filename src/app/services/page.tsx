
import PageBanner from '@/components/page-banner';
import OutstandingServices from '@/components/outstanding-services';

export default function ServicesPage() {
  return (
    <>
      <PageBanner title="Our Services" imageSrc="/images/features/mom&baby-min.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Our Services' }]} />
      <div className="py-12 md:py-16 lg:py-20">
        <OutstandingServices />
      </div>
    </>
  );
}
