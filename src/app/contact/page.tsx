
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import { Mail, Phone, MapPin } from 'lucide-react';
import { WhatsappIcon } from '@/components/whatsapp-icon';
import ContactCareTeamForm from '@/components/contact-care-team-form';

export default function ContactPage() {
  const locationUrl = "https://maps.google.com/maps?q=ONYX%20Medical%20and%20Fertility%20Center&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Contact Us" imageSrc="/images/doctors/onyx doc.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />

        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Contact Info */}
                    <div>
                        <div className="mb-8">
                            <p className="text-primary font-headline uppercase">Contact Info.</p>
                            <h2 className="text-3xl font-bold font-headline text-foreground mt-2">Connect With Us</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-headline text-foreground border-b pb-2">Information</h3>
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Phone Numbers</p>
                                    <p className="text-muted-foreground">0503671770</p>
                                    <p className="text-muted-foreground">0558101129</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Email</p>
                                    <p className="text-muted-foreground">onyxmfc21@gmail.com</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <WhatsappIcon className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">WhatsApp</p>
                                    <p className="text-muted-foreground">Chat with us</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <p className="font-semibold">Address</p>
                                    <p className="text-muted-foreground">P.O.Box AE 15, Atomic, Accra</p>
                                    <p className='text-muted-foreground'>Transition lane Rabbit Bus Stop, Haatso</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column: Contact Form */}
                    <div>
                        <div className="mb-8">
                             <p className="text-primary font-headline uppercase">Drop Us A Line</p>
                             <h2 className="text-3xl font-bold font-headline text-foreground mt-2">We'd Love To Hear From You</h2>
                        </div>

                        <ContactCareTeamForm isPublicForm={true} />
                    </div>
                </div>
            </div>
        </section>
        
        <section>
            <div className="w-full h-[450px]">
                <iframe
                    src={locationUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Onyx Medical and Fertility Center Location"
                ></iframe>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
