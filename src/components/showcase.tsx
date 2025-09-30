
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const images = [
  { src: "/images/showcase/equipment.jpg", alt: "Modern medical equipment" },
  { src: "/images/departments/surg 1-min.jpg", alt: "Surgeons in operating room" },
  { src: "/images/doctors/doctor-1.jpg", alt: "Team of doctors smiling" },
  { src: "/images/features/lab-2-min.jpg", alt: "Advanced laboratory" },
];

export default function Showcase() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center" data-aos="fade-up">
          <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm font-headline uppercase text-accent">Our facility and equipment</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline uppercase text-white">New Office And Equipment</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-delay="200">
          {images.map((image, index) => (
            <div key={index} className="relative group overflow-hidden aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-accent/80 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <Button asChild size="icon" variant="ghost" className="h-16 w-16 text-white hover:bg-transparent">
                        <Link href="/gallery">
                            <Plus className="h-12 w-12" />
                        </Link>
                     </Button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
