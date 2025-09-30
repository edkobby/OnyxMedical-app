
import { TestTube, HeartPulse, Brain, Bone, Baby, Eye, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const departments = [
  {
    imageSrc: "/images/showcase/laparoscopy2.webp",
    title: "Laparoscopy",
    description: "Minimally invasive 'keyhole' surgery for faster recovery and reduced scarring.",
  },
  {
    imageSrc: "/images/showcase/hysteroscopy-banner_0.jpg.webp",
    title: "Hysteroscopy",
    description: "Advanced uterine examination and treatment without any external incisions.",
  },
  {
    imageSrc: "/images/features/fert.jpg",
    title: "Gynecology / Women's Health",
    description: "Comprehensive care for women's health, from routine check-ups to specialized treatments.",
  },
  {
    imageSrc: "/images/departments/IVF.webp",
    title: "Fertility Treatment (IVF)",
    description: "Advanced IVF and fertility services to help you on your journey to parenthood.",
  },
  {
    imageSrc: "/images/departments/fertility-4.jpg",
    title: "Obstetrics / Antenatal",
    description: "Dedicated care for expectant mothers through every stage of pregnancy.",
  },
  {
    imageSrc: "/images/features/lab2 (2).jpg",
    title: "Laboratory",
    description: "State-of-the-art laboratory for accurate and timely diagnostic testing.",
  },
  {
    imageSrc: "/images/departments/child 1.jpg",
    title: "Child Health / Pediatrician",
    description: "Compassionate and complete healthcare services for infants, children, and adolescents.",
  },
  {
    imageSrc: "/images/departments/surg 1-min.jpg",
    title: "General Surgery",
    description: "Expert surgical procedures performed by our experienced team in a modern theater.",
  },
];

export default function Departments() {
  return (
    <section id="departments" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center" data-aos="fade-up">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">We Care Our Department Support</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline uppercase text-foreground">Our Outstanding Department</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We offer a wide range of specialized departments to cater to all your healthcare needs. Our expert teams are here to provide you with the best possible care.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12" data-aos="fade-up" data-aos-delay="200">
          {departments.map((dept, index) => (
            <Card key={index} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-background">
              <div className="relative w-full aspect-[4/2.5] overflow-hidden">
                <Image 
                  src={dept.imageSrc}
                  alt={dept.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold font-headline text-foreground">{dept.title}</h3>
                <p className="text-muted-foreground mt-2">{dept.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
