
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, startOfToday } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { toDate, serializeEvents } from '@/lib/events';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { Event } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

type View = 'month' | 'list';

export default function EventsSection() {
  const [initialEvents, setInitialEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const eventsCollection = collection(db, "events");
      const q = query(eventsCollection, where("status", "==", "Upcoming"));
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setInitialEvents(serializeEvents(events));
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!initialEvents) return [];
    return initialEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [initialEvents, searchTerm]);

  const upcomingEvents = useMemo(() => {
    const today = startOfToday();
    return filteredEvents
      .filter(event => toDate(event.date) >= today)
      .sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime());
  }, [filteredEvents]);

  const pastEvents = useMemo(() => {
    const today = startOfToday();
    return filteredEvents
      .filter(event => toDate(event.date) < today)
      .sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());
  }, [filteredEvents]);
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startingDay = getDay(monthStart);

    const eventsByDay = new Map<string, Event[]>();
    filteredEvents.forEach(event => {
      const eventDateStr = format(toDate(event.date), 'yyyy-MM-dd');
      if (!eventsByDay.has(eventDateStr)) {
        eventsByDay.set(eventDateStr, []);
      }
      eventsByDay.get(eventDateStr)?.push(event);
    });

    return (
      <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
        <div className="grid grid-cols-7 text-center font-bold font-headline text-foreground">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-px">
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-background/30 rounded-md"></div>
          ))}
          {daysInMonth.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const eventsForDay = eventsByDay.get(dayStr) || [];
            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative p-2 min-h-[120px] bg-background rounded-md transition-colors",
                  isSameDay(day, new Date()) ? 'bg-primary/10' : 'hover:bg-primary/5'
                )}
              >
                <div className={cn("font-bold", isSameDay(day, new Date()) ? 'text-primary' : 'text-foreground')}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {eventsForDay.slice(0, 2).map(event => (
                    <TooltipProvider key={event.id} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/calendar/${event.slug}`}>
                            <Badge variant="secondary" className="w-full text-left block truncate cursor-pointer hover:bg-primary hover:text-primary-foreground">
                              {event.title}
                            </Badge>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{event.title}</p>
                          <p className="text-sm text-muted-foreground">{format(toDate(event.date), "h:mm a")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {eventsForDay.length > 2 && (
                    <p className="text-xs text-muted-foreground mt-1">+{eventsForDay.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderListView = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold font-headline text-foreground mb-4">Upcoming Events</h3>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-6">
            {upcomingEvents.map(event => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming events found.</p>
        )}
      </div>
       <div>
        <h3 className="text-2xl font-bold font-headline text-foreground mb-4">Past Events</h3>
        {pastEvents.length > 0 ? (
          <div className="space-y-6">
            {pastEvents.map(event => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past events found.</p>
        )}
      </div>
    </div>
  );

  const EventListItem = ({ event }: { event: Event }) => {
    const eventDate = toDate(event.date);
    if (isNaN(eventDate.getTime())) {
      // Don't render if date is invalid
      return null;
    }

    return (
      <Card className="flex flex-col md:flex-row items-center p-4 gap-6 hover:shadow-lg transition-shadow">
        <div className="flex-shrink-0 text-center">
          <p className="text-primary text-4xl font-bold font-headline">{format(eventDate, 'dd')}</p>
          <p className="text-muted-foreground uppercase">{format(eventDate, 'MMM yyyy')}</p>
        </div>
        <div className="border-l border-border/50 pl-6 flex-grow">
          <h4 className="text-xl font-bold font-headline text-foreground hover:text-primary transition-colors">
            <Link href={`/calendar/${event.slug}`}>{event.title}</Link>
          </h4>
          <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {format(eventDate, 'h:mm a')}</div>
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</div>
          </div>
          <p className="text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
        </div>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <Skeleton className="h-10 w-full md:max-w-xs" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:max-w-xs">
            <Input
              placeholder="Search for events..."
              className="pr-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth}><ChevronLeft className="w-5 h-5" /></Button>
                <span className="text-lg font-bold font-headline text-foreground w-32 text-center">{format(currentDate, 'MMMM yyyy')}</span>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}><ChevronRight className="w-5 h-5" /></Button>
            </div>
             <Button variant="outline" onClick={handleToday}>This Month</Button>
          </div>

          <div className="flex items-center gap-2 p-1 bg-secondary rounded-md">
            <Button variant={view === 'list' ? 'outline' : 'ghost'} className={cn(view === 'list' && 'bg-background shadow-sm')} onClick={() => setView('list')}>List</Button>
            <Button variant={view === 'month' ? 'outline' : 'ghost'} className={cn(view === 'month' && 'bg-background shadow-sm')} onClick={() => setView('month')}>Month</Button>
          </div>
        </div>

        {view === 'month' ? renderCalendarView() : renderListView()}
      </div>
    </section>
  );
}
