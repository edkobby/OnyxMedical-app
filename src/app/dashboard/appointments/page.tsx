
"use client"
import Link from "next/link"
import * as React from "react"
import { PlusCircle } from "lucide-react"
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"
import type { Appointment } from "@/app/admin/appointments/page"
import { useToast } from "@/hooks/use-toast";

export default function DashboardAppointments() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = React.useState<Appointment[]>([]);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "appointments"), 
            where("patientId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apptsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
            setAppointments(apptsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching appointments: ", error);
            toast({
                title: "Error",
                description: "Could not fetch your appointments.",
                variant: "destructive"
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);

    const renderAppointmentTable = (appointmentsToShow: Appointment[]) => (
         <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : appointmentsToShow.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No appointments in this category.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointmentsToShow.map((appt) => (
                            <TableRow key={appt.id}>
                                <TableCell>
                                <div className="font-medium">{appt.doctorName}</div>
                                </TableCell>
                                <TableCell>{appt.service}</TableCell>
                                <TableCell className="hidden md:table-cell">{appt.dateTime}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                     <Badge variant={appt.status === "Completed" ? "default" : appt.status === "Canceled" ? "destructive" : "secondary"}>
                                        {appt.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline">Details</Button>
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
    const past = appointments.filter(a => a.status === 'Completed');
    const canceled = appointments.filter(a => a.status === 'Canceled');

  return (
    <>
      <div className="flex items-center justify-between">
         <DashboardHeader title="Appointments" description="Manage your past and upcoming appointments." />
        <Button asChild size="sm" className="gap-1">
          <Link href="/appointment">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Book Appointment
            </span>
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
            {renderAppointmentTable(upcoming)}
        </TabsContent>
        <TabsContent value="past">
            {renderAppointmentTable(past)}
        </TabsContent>
        <TabsContent value="canceled">
            {renderAppointmentTable(canceled)}
        </TabsContent>
      </Tabs>
    </>
  )
}
