
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getDoctorBySlug, getAllDoctors } from '@/lib/doctors';
import { Badge } from '@/components/ui/badge';
import PageBanner from '@/components/page-banner';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import CtaBar from '@/components/cta-bar';

export async function generateStaticParams() {
  const doctors = getAllDoctors();
  return doctors.map((doctor) => ({
    slug: doctor.slug,
  }));
}

export default function DoctorProfilePage({ params }: { params: { slug: string } }) {
  const doctor = getDoctorBySlug(params.slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="bg-background">
        <div className="sticky top-0 z-50">
            <TopBar />
        </div>
        <Header />
        <main>
            <PageBanner title={doctor.name} imageSrc={doctor.image || "/images/banners/doctors.jpg"} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Doctors', href: '/doctors' }, { label: doctor.name }]} />
            
            <section className="py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={doctor.image}
                                    alt={`Profile of ${doctor.name}`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={doctor.hint}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <h1 className="text-4xl font-bold font-headline text-foreground">{doctor.name}</h1>
                            <p className="text-xl text-primary font-semibold mt-1">{doctor.title}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {doctor.specialties.map(specialty => (
                                    <Badge key={specialty} variant="secondary">{specialty}</Badge>
                                ))}
                            </div>
                            <div className="prose prose-lg max-w-none text-muted-foreground mt-6">
                                {doctor.bio.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {doctor.galleryImages && doctor.galleryImages.length > 0 && (
                <section className="py-12 md:py-24 lg:py-32 bg-secondary">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-bold text-center font-headline text-foreground mb-12">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {doctor.galleryImages.map((image, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md group">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    data-ai-hint={image.hint}
                                />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CtaBar />
        </main>
        <Footer />
    </div>
  );
}
