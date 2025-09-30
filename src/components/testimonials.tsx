
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah L.",
    title: "Fertility Patient",
    quote: "The team at Onyx Medical was incredible. Their support and expertise made our dream of starting a family a reality. We are forever grateful.",
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Michael B.",
    title: "General OPD Patient",
    quote: "I've never felt so comfortable at a medical center. The staff is friendly, professional, and the care I received was outstanding.",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop",
  },
   {
    name: "Richael R.",
    title: "New Mother",
    quote: "The care I received during my pregnancy was top-notch. From diagnosis to delivery, the obstetrics team was thorough and reassuring every step of the way.",
    image: "https://placehold.co/1887x1258.png",
  },
];

const partners = [
    { src: "https://placehold.co/150x50.png", alt: "Partner 1", hint: "company logo" },
    { src: "https://placehold.co/150x50.png", alt: "Partner 2", hint: "company logo" },
    { src: "https://placehold.co/150x50.png", alt: "Partner 3", hint: "company logo" },
    { src: "https://placehold.co/150x50.png", alt: "Partner 4", hint: "company logo" },
    { src: "https://placehold.co/150x50.png", alt: "Partner 5", hint: "company logo" },
];

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Our Happy Customers</div>
                <h2 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl font-headline uppercase text-foreground">What People Say About Us</h2>
                <Carousel
                    opts={{ align: "start", loop: true, }}
                    className="w-full max-w-xl mx-auto pt-8"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index}>
                            <Card className="bg-transparent border-none shadow-none">
                                <CardContent className="p-0 space-y-4">
                                    <Quote className="w-12 h-12 text-accent" />
                                    <p className="text-muted-foreground text-lg italic">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-4 pt-4">
                                        <Image
                                            src={testimonial.image}
                                            alt={`Photo of ${testimonial.name}`}
                                            width={60}
                                            height={60}
                                            className="rounded-full object-cover"
                                            data-ai-hint="person portrait"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold font-headline text-foreground">{testimonial.name}</h3>
                                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="pt-4">
                        <CarouselPrevious className="static -translate-x-0 -translate-y-0" />
                        <CarouselNext className="static -translate-x-0 -translate-y-0" />
                    </div>
                </Carousel>
            </div>
            <div>
                 <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">We believe in what you believe</div>
                <h2 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl font-headline uppercase text-foreground">Our Trusted Partners</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8">
                    {partners.map((partner, index) => (
                        <div key={index} className="flex justify-center items-center p-4 bg-background rounded-lg filter grayscale hover:grayscale-0 transition-all duration-300">
                            <Image 
                                src={partner.src}
                                alt={partner.alt}
                                width={150}
                                height={50}
                                data-ai-hint={partner.hint}
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
