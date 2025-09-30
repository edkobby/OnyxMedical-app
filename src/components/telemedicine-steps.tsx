
import { Calendar, Video, Stethoscope, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    icon: Calendar,
    title: 'Book Your Slot',
    description: 'Fill out the form below with your details and preferred time. Only for registered patients.',
  },
  {
    icon: Stethoscope,
    title: 'Confirm & Pay',
    description: 'Our team will contact you to confirm your appointment and provide payment details.',
  },
  {
    icon: Video,
    title: 'Join the Call',
    description: 'You will receive a secure link for your chosen platform (WhatsApp or Google Meet) before your session.',
  },
  {
    icon: MessageSquare,
    title: 'Consult Your Doctor',
    description: 'Connect with your specialist for a confidential consultation and receive expert medical advice.',
  },
];

export default function TelemedicineSteps() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline uppercase text-foreground">How It Works</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Four simple steps to get the virtual care you need.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
          {steps.map((step, index) => (
            <Card key={index} className="text-center p-6 bg-background">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <step.icon className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <CardHeader className="p-0">
                    <CardTitle className="font-headline text-xl text-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                    <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
