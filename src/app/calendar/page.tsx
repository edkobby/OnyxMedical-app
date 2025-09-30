
"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import EventsSection from '@/components/events-section';

export default function CalendarPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Events Calendar" imageSrc="/images/banners/calendar.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Calendar' }]} />
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
}
