
import { faqs } from '@/lib/faq';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from './ui/button';

export default function FaqSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: FAQs */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold font-headline text-foreground mb-8">
              Your Questions Answered
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column: Contact CTA */}
          <div className="lg:col-span-1">
             <div className="bg-secondary p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold font-headline text-foreground">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground mt-4">
                  Can't find the answer you're looking for? Please don't hesitate to reach out to our friendly team. We're here to help.
                </p>
                <Button asChild variant="accent" className="mt-6 w-full">
                    <Link href="/contact">
                        Contact Us
                    </Link>
                </Button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
