
import Image from 'next/image';

export default function TelemedicineHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Virtual Consultations</div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline uppercase text-foreground">Convenient Care from Home</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Access expert medical advice from our specialists without leaving your home. Our secure telemedicine service brings quality healthcare to you, wherever you are.
            </p>
            <ul className="grid gap-2 text-muted-foreground">
              <li>✓ Save time on travel and waiting rooms</li>
              <li>✓ Receive follow-up care and prescriptions remotely</li>
              <li>✓ Maintain privacy with secure, confidential consultations</li>
              <li>✓ Easy to use on your smartphone, tablet, or computer</li>
            </ul>
          </div>
          <div className="relative h-full min-h-[300px] md:min-h-[500px]">
            <Image
              src="/images/banners/patient1.jpg"
              alt="Patient having a video call with a doctor"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
