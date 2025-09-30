import Link from "next/link";
import { Button } from "./ui/button";

export default function CtaBar() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-accent">
      <div className="container mx-auto px-4 md:px-6 text-center text-accent-foreground">
        <h2 className="text-2xl md:text-3xl font-bold font-headline uppercase">
          You're in love with hope & want to stand out?
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="bg-foreground hover:bg-foreground/80">
            <Link href="#doctors">Explore Doctors</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background">
            <Link href="#appointment">Book Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
