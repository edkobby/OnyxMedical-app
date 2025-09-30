
"use client"
import * as React from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { addDoc, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp, collection, getDocs, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/types";
import { format, parseISO } from "date-fns";

// Helper function to create a URL-friendly slug
const createSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

export default function AdminEventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const { toast } = useToast();

  const fetchEvents = React.useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const eventsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id,
                    ...data,
                    date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
                } as Event
            });
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast({
                title: "Error fetching data",
                description: "Could not retrieve events. Please check permissions.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddNew = () => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter(e => e.id !== eventId));
      toast({ title: "Event Deleted", description: "The event has been successfully deleted." });
    } catch (error) {
      toast({ title: "Deletion Failed", description: "Could not delete the event.", variant: "destructive" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File;
    let imageUrl = selectedEvent?.imageUrl || '';
    
    const eventData: Omit<Event, 'id' | 'createdAt'> = {
      title,
      slug: createSlug(title),
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      imageUrl: imageUrl, // temporary
      status: formData.get('status') as 'Upcoming' | 'Completed' | 'Canceled',
    };

    try {
      if (imageFile && imageFile.size > 0) {
        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
        eventData.imageUrl = imageUrl;
      }

      if (selectedEvent && selectedEvent.id) {
        const eventRef = doc(db, "events", selectedEvent.id);
        await updateDoc(eventRef, eventData);
        setEvents(events.map(e => e.id === selectedEvent.id ? { ...selectedEvent, ...eventData } : e));
        toast({ title: "Event Updated", description: "The event details have been saved." });
      } else {
        if (!eventData.imageUrl) {
            eventData.imageUrl = 'https://placehold.co/1200x600.png'
        }
        const newDocRef = await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: serverTimestamp(),
        });
        const newEvent: Event = {
          id: newDocRef.id,
          ...eventData,
          createdAt: new Date().toISOString(),
        }
        setEvents([newEvent, ...events]);
        toast({ title: "Event Created", description: "The new event has been added." });
      }
      setIsDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
       console.error("Error saving event:", error);
       toast({ title: "Submission Failed", description: "An error occurred while saving the event.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
   const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'secondary';
      case 'Completed':
        return 'default';
      case 'Canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Manage health events, screenings, and awareness dates.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto"/></TableCell>
                  </TableRow>
                ))
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(parseISO(event.date as string), 'PPP')}</TableCell>
                    <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(event)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(event.id!)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedEvent(null); }}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                  <DialogDescription>
                      Fill in the details for the event below.
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="max-h-[75vh] overflow-y-auto pr-6 grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={selectedEvent?.title} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" defaultValue={selectedEvent?.date ? new Date(selectedEvent.date as string).toISOString().split('T')[0] : ''} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" defaultValue={selectedEvent?.location} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea id="description" name="description" defaultValue={selectedEvent?.description} required rows={4} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="image">Feature Image</Label>
                       {selectedEvent?.imageUrl && <img src={selectedEvent.imageUrl} alt="Current feature" className="w-32 h-auto rounded-md border" />}
                      <Input id="image" name="image" type="file" accept="image/*" />
                       <p className="text-xs text-muted-foreground">Upload a new image to replace the current one.</p>
                  </div>
                   <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={selectedEvent?.status || 'Upcoming'}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                  <DialogFooter className="pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm -mx-6 px-6 -mb-4 pb-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Event'}
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}
