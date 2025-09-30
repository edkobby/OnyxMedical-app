
"use client"

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Share2 } from 'lucide-react';
import { format } from 'date-fns';

import type { Event as EventType } from '@/lib/types';
import { toDate } from '@/lib/events';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EventDetailsCardProps {
  event: EventType;
}

export default function EventDetailsCard({ event }: EventDetailsCardProps) {
  const [pageUrl, setPageUrl] = useState('');
  
  // Use the toDate helper for safe date conversion
  const startDate = toDate(event.date);
  // Assuming end date is same day for simplicity, can be expanded later
  const endDate = toDate(event.date);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);
  
  const formatEventDate = (start: Date, end: Date) => {
    const startDateStr = format(start, "MMMM d, yyyy");
    const endDateStr = format(end, "MMMM d, yyyy");
    if (startDateStr === endDateStr) {
      return startDateStr;
    }
    return `${startDateStr} - ${endDateStr}`;
  };

  const formatEventTime = (start: Date) => {
    // Assuming time is part of the date string for now
    return format(start, "h:mm a");
  };

  const generateCalendarLink = (type: 'google' | 'outlook' | 'yahoo' | 'ical') => {
    const startTime = format(startDate, "yyyyMMdd'T'HHmmss");
    const endTime = format(endDate, "yyyyMMdd'T'HHmmss");
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);

    switch (type) {
      case 'google':
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&subject=${title}&body=${details}&location=${location}`;
      case 'yahoo':
         return `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startTime}&et=${endTime}&desc=${details}&in_loc=${location}`;
      case 'ical':
        const icalContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          `URL:${pageUrl}`,
          `DTSTART:${startTime}`,
          `DTEND:${endTime}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description}`,
          `LOCATION:${event.location}`,
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\\n');
        return `data:text/calendar;charset=utf8,${encodeURIComponent(icalContent)}`;
      default:
        return '#';
    }
  };

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold font-headline text-foreground border-b pb-4 mb-4">Event Details</h3>
      <div className="space-y-4 text-foreground/80">
        <div className="flex items-start gap-4">
          <Calendar className="h-5 w-5 text-primary mt-1"/>
          <div>
            <p className="font-semibold text-foreground">Date</p>
            <p>{formatEventDate(startDate, endDate)}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Clock className="h-5 w-5 text-primary mt-1"/>
          <div>
            <p className="font-semibold text-foreground">Time</p>
            <p>{formatEventTime(startDate)}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin className="h-5 w-5 text-primary mt-1"/>
          <div>
            <p className="font-semibold text-foreground">Location</p>
            <p>{event.location}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="accent" className="flex-1">
              <Plus className="mr-2 h-4 w-4" /> Add to Calendar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild><a href={generateCalendarLink('google')} target="_blank" rel="noopener noreferrer">Google Calendar</a></DropdownMenuItem>
            <DropdownMenuItem asChild><a href={generateCalendarLink('outlook')} target="_blank" rel="noopener noreferrer">Outlook Calendar</a></DropdownMenuItem>
            <DropdownMenuItem asChild><a href={generateCalendarLink('yahoo')} target="_blank" rel="noopener noreferrer">Yahoo Calendar</a></DropdownMenuItem>
            <DropdownMenuItem asChild><a href={generateCalendarLink('ical')} download={`${event.slug}.ics`}>iCalendar (.ics)</a></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
