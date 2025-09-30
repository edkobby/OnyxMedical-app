
import { Wrench } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface ComingSoonProps {
    pageName: string;
}

export default function ComingSoon({ pageName }: ComingSoonProps) {
  return (
    <section className="py-24 md:py-32 lg:py-40 text-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <Wrench className="h-24 w-24 text-primary animate-bounce" />
          <h2 className="mt-8 text-4xl font-bold font-headline text-foreground">
            Coming Soon!
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            We're working hard to bring you the {pageName} page. Please check back later for updates.
          </p>
          <Button asChild className="mt-8" variant="accent">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
