
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        image: "/images/showcase/laparoscopy2.webp",
        title: "Laparoscopy",
        description: "Minimally invasive 'keyhole' surgery for faster recovery and reduced scarring.",
        bgColorClass: "bg-foreground",
        buttonVariant: "accent",
        href: "/services/laparoscopy"
    },
    {
        image: "/images/showcase/hysteroscopy-banner_0.jpg.webp",
        title: "Hysteroscopy",
        description: "Advanced uterine examination and treatment without any external incisions.",
        bgColorClass: "bg-accent",
        buttonVariant: "default",
        href: "/services/hysteroscopy"
    },
    {
        image: "/images/gallery/surg 1-min.png",
        title: "General Surgery",
        description: "Expert surgical procedures performed by our experienced team in a modern theater.",
        bgColorClass: "bg-foreground",
        buttonVariant: "accent",
        href: "/services/general-surgery"
    }
];

export default function FeatureCards() {
    return (
        <section className="w-full -mt-12 md:-mt-20 relative z-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-foreground shadow-lg transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden rounded-lg p-0 border-0 flex flex-col">
                            <div className="relative w-full h-48">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className={`${feature.bgColorClass} p-6 text-center text-white flex flex-col flex-grow`}>
                                <h3 className="font-headline text-2xl">{feature.title}</h3>
                                <p className="text-white/80 my-4 flex-grow">{feature.description}</p>
                                <Button 
                                    asChild 
                                    variant={feature.buttonVariant as any} 
                                    className={feature.buttonVariant === 'default' ? 'bg-foreground text-white hover:bg-foreground/80 rounded-md' : 'rounded-md'}
                                >
                                    <Link href={feature.href}>More Info</Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
