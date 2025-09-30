
"use client"
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import PageBanner from '@/components/page-banner';
import DoctorCtaBar from '@/components/doctor-cta-bar';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Doctor } from '@/lib/types';


export default function DoctorsPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, "doctors"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const doctorsData: Doctor[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(doctorsData);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Our Doctors" imageSrc="/images/doctors/doc5.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Our Doctors' }]} />
        
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Meet Our Experienced Doctors</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline uppercase text-foreground">We Are Experts In Our Field</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-12">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="group text-center">
                    <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                    <div className="mt-6 space-y-2">
                      <Skeleton className="h-6 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                  </div>
                ))
              ) : (
                doctors.map((doctor) => (
                  <div key={doctor.id} className="group text-center">
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={doctor.avatar}
                        alt={`Photo of ${doctor.name}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        data-ai-hint="doctor portrait"
                      />
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-bold font-headline text-foreground">{doctor.name}</h3>
                      <p className="text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <DoctorCtaBar />
      </main>
      <Footer />
    </div>
  );
}
