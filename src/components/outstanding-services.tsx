
"use client"
import * as React from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { LucideIcon } from 'lucide-react';
import { servicesList as defaultServices, Service } from '@/lib/content-data';
import { Skeleton } from './ui/skeleton';
import { Stethoscope } from 'lucide-react';

const serviceIconMap: { [key: string]: LucideIcon } = defaultServices.reduce((acc, service) => {
    acc[service.title.toLowerCase().replace(/ /g, '-')] = service.icon;
    return acc;
}, {} as { [key: string]: LucideIcon });


export default function OutstandingServices() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const contentDocRef = doc(db, "content", "website");
    const unsubscribe = onSnapshot(contentDocRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().services) {
            const fetchedServices = docSnap.data().services.map((s: any) => ({
                ...s,
                icon: serviceIconMap[s.id] || Stethoscope,
            }));
            setServices(fetchedServices);
        } else {
          // If no services are found in the database, use the default list.
          setServices(defaultServices);
        }
        setLoading(false);
    }, (error) => {
        console.error("Error fetching services: ", error);
        // Fallback to default services on error
        setServices(defaultServices);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-10 w-80" />
                </div>
                 <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-12">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-start gap-6 p-6">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </section>
    )
  }

  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Better Service at any time</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline uppercase text-foreground">Our Outstanding Services</h2>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group flex items-start gap-6 transition-all duration-300">
                <div className="bg-accent/10 p-4 rounded-md group-hover:bg-accent transition-all duration-300">
                  {Icon && <Icon className="w-8 h-8 text-accent group-hover:text-accent-foreground" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline text-foreground group-hover:text-primary">{service.title}</h3>
                  <p className="text-muted-foreground mt-2">{service.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
