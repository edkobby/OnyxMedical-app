
"use client"
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { aboutContent as defaultContent } from '@/lib/content-data';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';


interface AboutContentData {
    beginning: string;
    commitment: string;
    mission: string;
    vision: string;
}

export default function AboutContent() {
  const [content, setContent] = React.useState<AboutContentData | null>(null);
  const [loading, setLoading] = React.useState(true);

   React.useEffect(() => {
    const fetchData = async () => {
        const docRef = doc(db, "content", "website");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().about) {
            setContent(docSnap.data().about);
        } else {
            setContent(defaultContent);
        }
        setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !content) {
    return (
        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="space-y-4">
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                     <div className="space-y-8">
                        <div className="flex gap-6">
                            <Skeleton className="w-1/2 aspect-[4/3] rounded-lg" />
                            <div className="w-1/2 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                         <div className="flex gap-6">
                            <Skeleton className="w-1/2 aspect-[4/3] rounded-lg" />
                            <div className="w-1/2 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
  }

  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Our Stories */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-headline text-foreground">Our Story</h3>
            <div className="space-y-4 text-muted-foreground">
              <h4 className="font-bold text-foreground">Our Humble Beginning</h4>
              <p>{content.beginning}</p>
              
              <h4 className="font-bold text-foreground">Our Commitment to Excellence</h4>
              <p>{content.commitment}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Patient-centered and compassionate care.</li>
                <li>Upholding the highest medical standards.</li>
                <li>Continuous investment in advanced technology.</li>
                <li>Building a community of health and hope.</li>
              </ul>
            </div>
          </div>
          
          {/* Right Column: Mission & Vision */}
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="relative w-1/2 aspect-[4/3]">
                <Image src="/images/stock/mission.png" alt="Our Mission" data-ai-hint="medical team meeting" fill className="object-cover rounded-lg"/>
              </div>
              <div className="w-1/2 space-y-2">
                <h4 className="text-xl font-bold font-headline text-foreground">Our Missions</h4>
                <p className="text-muted-foreground">{content.mission}</p>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                    <Link href="/services">Our Services &rarr;</Link>
                </Button>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="relative w-1/2 aspect-[4/3]">
                <Image src="/images/stock/vision.png" alt="Our Vision & Plan" data-ai-hint="doctor looking future" fill className="object-cover rounded-lg"/>
              </div>
              <div className="w-1/2 space-y-2">
                <h4 className="text-xl font-bold font-headline text-foreground">Our Vision & Plan</h4>
                <p className="text-muted-foreground">{content.vision}</p>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                    <Link href="/contact">Contact Us &rarr;</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
