
"use client"
import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { doc, updateDoc, writeBatch, collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { createNotification } from "@/lib/notifications";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

export interface Appointment {
  id: string,
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  service: string;
  dateTime: string;
  status: 'Upcoming' | 'Completed' | 'Canceled';
  createdAt: string; // Serialized
}


export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const appointmentsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            } as Appointment;
        });
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        toast({
            title: "Error fetching data",
            description: "Could not retrieve appointments. Please check your permissions.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [toast]);

  const handleStatusChange = async (appointment: Appointment, newStatus: 'Upcoming' | 'Completed' | 'Canceled') => {
    const appointmentRef = doc(db, "appointments", appointment.id);
    try {
      await updateDoc(appointmentRef, { status: newStatus });
      
      const updatedAppointments = appointments.map(appt => 
          appt.id === appointment.id ? { ...appt, status: newStatus } : appt
      );
      setAppointments(updatedAppointments);

      await addDoc(collection(db, "emails"), {
          to: appointment.patientEmail,
          message: {
            subject: `Appointment Status Updated: ${newStatus}`,
            html: `
              <h1>Your Appointment has been updated!</h1>
              <p>Hello ${appointment.patientName},</p>
              <p>This is to confirm that your appointment has been updated to the following status: <strong>${newStatus}</strong>.</p>
              <p><strong>Appointment Details:</strong></p>
              <ul>
                <li><strong>Service:</strong> ${appointment.service}</li>
                <li><strong>Doctor:</strong> ${appointment.doctorName}</li>
                <li><strong>Date & Time:</strong> ${appointment.dateTime}</li>
              </ul>
              <p>If you have any questions, please contact our front desk.</p>
              <p>Thank you,<br/>The Onyx Medical Team</p>
            `,
          },
      });

      await createNotification({
        recipientId: appointment.patientId,
        title: `Appointment ${newStatus}`,
        description: `Your appointment for ${appointment.service} on ${appointment.dateTime} has been marked as ${newStatus}.`,
        type: 'appointment_update',
        href: '/dashboard/appointments'
      });

      toast({
        title: "Appointment Updated",
        description: `The appointment has been marked as ${newStatus}. An email notification has been sent.`,
      });
    } catch (error) {
       toast({
        title: "Update Failed",
        description: `There was an error updating the appointment.`,
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const renderAppointmentsTable = (appointmentsToShow: Appointment[]) => (
     <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Doctor</TableHead>
              <TableHead className="hidden md:table-cell">Service</TableHead>
              <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24"/></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-40"/></TableCell>
                        <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto"/></TableCell>
                    </TableRow>
                ))
            ) : appointmentsToShow.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No appointments in this category.</TableCell>
                </TableRow>
            ) : (
                appointmentsToShow.map((appt) => (
                <TableRow key={appt.id}>
                    <TableCell>
                    <div className="font-medium">{appt.patientName}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                        {appt.patientEmail}
                    </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{appt.doctorName}</TableCell>
                    <TableCell className="hidden md:table-cell">{appt.service}</TableCell>
                    <TableCell className="hidden lg:table-cell">{appt.dateTime}</TableCell>
                    <TableCell>
                    <Badge variant={appt.status === "Completed" ? "default" : appt.status === "Canceled" ? "destructive" : "secondary"}>
                        {appt.status}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(appt)}>View Details</DropdownMenuItem>
                        {appt.status !== 'Completed' && <DropdownMenuItem onClick={() => handleStatusChange(appt, 'Completed')}>Mark as Completed</DropdownMenuItem>}
                        {appt.status !== 'Canceled' && <DropdownMenuItem onClick={() => handleStatusChange(appt, 'Canceled')} className="text-destructive">Cancel</DropdownMenuItem>}
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
  )

  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  const completed = appointments.filter(a => a.status === 'Completed');
  const canceled = appointments.filter(a => a.status === 'Canceled');

  return (
    <>
      <Tabs defaultValue="upcoming">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="upcoming">
          {renderAppointmentsTable(upcoming)}
        </TabsContent>
        <TabsContent value="completed">
          {renderAppointmentsTable(completed)}
        </TabsContent>
        <TabsContent value="canceled">
          {renderAppointmentsTable(canceled)}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Appointment Details</DialogTitle>
                  <DialogDescription>
                      Full details for the scheduled appointment.
                  </DialogDescription>
              </DialogHeader>
              {selectedAppointment && (
                <div className="grid gap-4 py-4 text-sm">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Patient:</span>
                    <span className="col-span-2 font-medium">{selectedAppointment.patientName}</span>
                  </div>
                   <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="col-span-2">{selectedAppointment.patientEmail}</span>
                  </div>
                   <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="col-span-2">{selectedAppointment.patientPhone}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="col-span-2 font-medium">{selectedAppointment.doctorName}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="col-span-2">{selectedAppointment.service}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Date & Time:</span>
                    <span className="col-span-2">{selectedAppointment.dateTime}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="col-span-2">
                       <Badge variant={selectedAppointment.status === "Completed" ? "default" : selectedAppointment.status === "Canceled" ? "destructive" : "secondary"}>
                        {selectedAppointment.status}
                      </Badge>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground">Booked On:</span>
                    <span className="col-span-2">{format(parseISO(selectedAppointment.createdAt), "PPP")}</span>
                  </div>
                </div>
              )}
              <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  )
}
