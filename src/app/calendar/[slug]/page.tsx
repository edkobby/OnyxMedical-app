
"use client"

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import PageBanner from '@/components/page-banner';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import EventDetailsCard from '@/components/event-details-card';
import type { Event as EventType } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { serializeEvent } from '@/lib/events';


async function getEventBySlug(slug: string): Promise<EventType | null> {
    const eventsCollection = collection(db, "events");
    const q = query(eventsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];
    const rawEvent = { id: doc.id, ...doc.data() } as EventType;
    return serializeEvent(rawEvent); // Serialize it for client use
}


export default function EventDetailPage() { 
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchEvent = async () => {
        const fetchedEvent = await getEventBySlug(slug);
        if (!fetchedEvent) {
            notFound();
        } else {
           setEvent(fetchedEvent);
           setLoading(false);
        }
    }
    fetchEvent();
  }, [slug]);

  if (loading || !event) {
    return (
        <div className="bg-background">
          <div className="sticky top-0 z-50">
            <TopBar />
          </div>
          <Header />
          <main>
             <PageBanner title="..." imageSrc="/images/banners/events.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/calendar' }]} />
             <section className="py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-8">
                             <Skeleton className="w-full aspect-[2/1] rounded-lg" />
                             <Skeleton className="h-10 w-3/4" />
                             <Skeleton className="h-24 w-full" />
                        </div>
                        <div className="md:col-span-1">
                             <Skeleton className="w-full h-64 rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>
          </main>
          <Footer />
        </div>
    )
  }
  
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title={event.title} imageSrc={event.imageUrl || '/images/banners/events.jpg'} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/calendar' }, { label: event.title }]} />
        
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden shadow-lg mb-8">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    data-ai-hint="event poster"
                  />
                </div>
                <h1 className="text-4xl font-bold font-headline text-foreground">{event.title}</h1>
                <div className="prose prose-lg max-w-none text-muted-foreground mt-6">
                  <p>{event.description}</p>
                </div>
              </div>
              <div className="md:col-span-1">
                 <EventDetailsCard event={event} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
