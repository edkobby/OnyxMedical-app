
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import * as React from 'react';
import { Skeleton } from './ui/skeleton';
import type { Doctor } from '@/lib/types';


export default function Doctors() {
  const [doctorsList, setDoctorsList] = React.useState<Doctor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, "doctors"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const doctorsData: Doctor[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctorsList(doctorsData);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="doctors" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center" data-aos="fade-up">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Welcome to Onyx Medical</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline uppercase text-foreground">We Are Experts In Our Field</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our team of highly qualified and experienced doctors is here to provide you with the best care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12" data-aos="fade-up" data-aos-delay="200">
           {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="group text-center">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                        <Skeleton className="h-9 w-28 mx-auto" />
                    </div>
                </div>
             ))
           ) : (
            doctorsList.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="group text-center">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                  <Image
                      src={doctor.avatar}
                      alt={`Photo of ${doctor.name}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint="doctor portrait"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold font-headline text-foreground">{doctor.name}</h3>
                  <p className="text-sm text-primary font-semibold uppercase">{doctor.specialty}</p>
                   <Button asChild variant="link" className="mt-2">
                    <Link href={`/doctors`}>View Profile &rarr;</Link>
                  </Button>
                </div>
              </div>
            ))
           )}
        </div>
      </div>
    </section>
  );
}
