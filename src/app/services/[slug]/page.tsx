
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServiceBySlug, getOtherServices, ServiceData } from '@/lib/service-details';
import PageBanner from '@/components/page-banner';
import { CheckCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export async function generateStaticParams() {
  // This part can be expanded if you fetch slugs from a CMS
  const slugs = ['laparoscopy', 'hysteroscopy', 'fertility-treatment', 'general-surgery'];
  return slugs.map((slug) => ({
    slug,
  }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  const otherServices = getOtherServices(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <>
        <PageBanner title={service.title} imageSrc={service.mainImage || "https://placehold.co/1920x768.png"} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.title }]} />
        
        <div className="container mx-auto py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden shadow-lg mb-8">
                <Image
                  src={service.mainImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                  data-ai-hint="medical service"
                />
              </div>
              <h1 className="text-4xl font-bold font-headline text-foreground">{service.title}</h1>
              <div className="prose prose-lg max-w-none text-muted-foreground mt-6">
                  {service.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>

              {(service.tests || service.applications) && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold font-headline text-foreground mb-6">Common Procedures & Applications</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-muted-foreground">
                    {(service.applications || service.tests)?.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.features && (
                  <div className="mt-12">
                      <h3 className="text-2xl font-bold font-headline text-foreground mb-6">Key Features</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                          {service.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-3">
                                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                  <div>
                                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                  <CardHeader>
                      <CardTitle>Other Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ul className="space-y-2">
                          {otherServices.map((other) => (
                              <li key={other.slug}>
                                  <Button variant="ghost" asChild className="w-full justify-start">
                                      <Link href={`/services/${other.slug}`} className="flex items-center gap-2">
                                          <PlusCircle className="h-4 w-4" />
                                          {other.title}
                                      </Link>
                                  </Button>
                              </li>
                          ))}
                      </ul>
                  </CardContent>
              </Card>

               <Card className="bg-secondary">
                  <CardHeader>
                      <CardTitle>Need Assistance?</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4">
                          If you have any questions or need to book an appointment, please don't hesitate to contact us.
                      </p>
                      <Button asChild variant="accent" className="w-full">
                          <Link href="/contact">Contact Us</Link>
                      </Button>
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </>
  );
}
