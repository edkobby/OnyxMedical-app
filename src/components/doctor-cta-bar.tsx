import Link from "next/link";
import { Button } from "./ui/button";

export default function DoctorCtaBar() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-accent">
      <div className="container mx-auto px-4 md:px-6 text-center text-accent-foreground">
        <h2 className="text-2xl md:text-3xl font-bold font-headline uppercase">
          Ready to meet our team?
        </h2>
        <p className="mt-2 text-lg text-accent-foreground/80">Schedule a consultation to get started.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="bg-foreground hover:bg-foreground/80">
            <Link href="/appointment">Book Appointment</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
