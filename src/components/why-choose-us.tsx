
import Image from "next/image";

export default function WhyChooseUs() {
    return (
        <section className="w-full bg-foreground text-background">
            <div className="mx-auto">
                <div className="grid lg:grid-cols-2 items-center">
                    <div className="space-y-6 p-8 md:p-12 lg:p-16" data-aos="fade-right">
                        <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent font-headline uppercase">Why Choose Us</div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline uppercase">The reason that you should contact us</h2>
                        
                        <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent text-accent-foreground font-bold font-headline text-2xl">1</div>
                                <div className="grid gap-1">
                                    <h3 className="text-xl font-bold font-headline">Advanced Technology</h3>
                                    <p className="text-background/70">We use the latest medical technology to provide accurate diagnoses and effective treatments.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent text-accent-foreground font-bold font-headline text-2xl">2</div>
                                <div className="grid gap-1">
                                    <h3 className="text-xl font-bold font-headline">Experienced Specialists</h3>
                                    <p className="text-background/70">Our team consists of highly skilled and experienced specialists in various medical fields.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent text-accent-foreground font-bold font-headline text-2xl">3</div>
                                <div className="grid gap-1">
                                    <h3 className="text-xl font-bold font-headline">Patient-Centered Care</h3>
                                    <p className="text-background/70">Your comfort and well-being are our top priorities. We provide personalized care tailored to your needs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="relative h-96 lg:h-full min-h-[400px] lg:min-h-[500px] w-full" data-aos="fade-left">
                         <Image 
                            src="/images/doctors/doc4.jpg"
                            alt="Doctor in a lab"
                            fill
                            className="object-cover"
                            data-ai-hint="doctors group"
                        />
                     </div>
                </div>
            </div>
        </section>
    )
}
