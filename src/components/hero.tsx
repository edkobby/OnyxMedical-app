
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Skeleton } from "./ui/skeleton";

const staticSlides = [
  {
    image: "/images/hero/mom&baby-min.jpg",
    headline: "Your Health is Our Priority",
    subtext: "Providing compassionate, comprehensive, and high-quality medical care for every stage of life.",
    cta1: { text: "Our Services", href: "/services" },
    cta2: { text: "Get Free Quote", href: "#appointment" },
  },
  {
    image: "/images/hero/onyx 1.jpg",
    headline: "Your Partner in Fertility and Wellness",
    subtext: "Combining advanced technology with a personal touch to help you achieve your family dreams.",
    cta1: { text: "Learn More", href: "/services/fertility-treatment" },
    cta2: { text: "Contact Us", href: "/contact" },
  },
  {
    image: "/images/hero/doc5 (2).jpg",
    headline: "Advanced Care, Close to Home",
    subtext: "We set the standards others try to live up to. Experience the difference at Onyx Medical.",
    cta1: { text: "Our Departments", href: "/departments" },
    cta2: { text: "Book Now", href: "/appointment" },
  },
  {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    headline: "Innovation in Every Detail",
    subtext: "Our investment in cutting-edge technology ensures you receive the most advanced and precise care available.",
    cta1: { text: "Explore Technology", href: "/about" },
    cta2: { text: "See Our Services", href: "/services" },
  },
  {
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop",
    headline: "A Team You Can Trust",
    subtext: "Meet our dedicated team of specialists, committed to providing personalized care and support.",
    cta1: { text: "Meet Our Doctors", href: "/doctors" },
    cta2: { text: "Book a Consultation", href: "/appointment" },
  },
  {
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070&auto=format&fit=crop",
    headline: "Empowering Your Health Journey",
    subtext: "From preventive care to specialized treatments, we are here to support you every step of the way.",
    cta1: { text: "Patient Resources", href: "/faq" },
    cta2: { text: "Get In Touch", href: "/contact" },
  },
]

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [heroContent, setHeroContent] = React.useState({ headline: "", subtext: "" });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const contentDocRef = doc(db, "content", "website");
    const unsubscribe = onSnapshot(contentDocRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            if(data.hero && data.hero.headline) {
              setHeroContent(data.hero);
            }
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const slides = [
    {
      image: staticSlides[0].image,
      headline: loading ? "Loading..." : (heroContent.headline || staticSlides[0].headline),
      subtext: loading ? "Please wait..." : (heroContent.subtext || staticSlides[0].subtext),
      cta1: staticSlides[0].cta1,
      cta2: staticSlides[0].cta2,
    },
    ...staticSlides.slice(1)
  ]

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh]">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full h-[70vh] md:h-[80vh]">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  className="object-cover brightness-50"
                  priority={index === 0}
                  data-ai-hint="medical hero background"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    {loading && index === 0 ? (
                      <div className="space-y-4 max-w-2xl mx-auto">
                        <Skeleton className="h-12 w-full bg-white/20" />
                        <Skeleton className="h-6 w-3/4 mx-auto bg-white/20" />
                        <Skeleton className="h-6 w-1/2 mx-auto bg-white/20" />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl md:text-5xl font-bold font-headline uppercase" data-aos="fade-down">
                          {slide.headline}
                        </h1>
                        <p className="mt-4 max-w-2xl text-base md:text-lg text-white/90" data-aos="fade-up" data-aos-delay="200">
                          {slide.subtext}
                        </p>
                      </>
                    )}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
                      <Button asChild size="lg" variant="accent">
                        <Link href={slide.cta1.href}>{slide.cta1.text}</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-foreground">
                        <Link href={slide.cta2.href}>{slide.cta2.text}</Link>
                      </Button>
                    </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex !bg-white/20 !border-white text-white hover:!bg-white/40" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex !bg-white/20 !border-white text-white hover:!bg-white/40" />
      </Carousel>
    </section>
  )
}
