
"use client"
import Link from "next/link"
import * as React from "react"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Calendar,
  Clock,
  ClipboardCheck,
  FileText
} from "lucide-react"
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/auth-context";
import { format, isFuture, isPast } from "date-fns";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DashboardHeader from "@/components/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment } from "@/app/admin/appointments/page";


export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  
  const userName = user?.displayName?.split(' ')[0] || 'there';

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
    });

    return () => unsubscribe();
  }, [user]);

  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const recentVisits = appointments.filter(a => a.status === 'Completed').slice(0, 3);
  const nextAppointment = upcomingAppointments[0];
  const lastVisit = recentVisits[0];

  return (
    <>
    <DashboardHeader title="Overview" description={`Welcome back, ${userName}. Here's a summary of your health dashboard.`} />
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">
            Upcoming Appointments
          </CardTitle>
          <Calendar className="h-4 w-4 text-white/90" />
        </CardHeader>
        <CardContent>
           {loading ? <Skeleton className="h-7 w-12 bg-white/20" /> : <div className="text-2xl font-bold">{upcomingAppointments.length}</div>}
          <p className="text-xs text-white/80">
            {nextAppointment ? `Next one is with ${nextAppointment.doctorName}` : 'No upcoming appointments.'}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">
            Active Prescriptions
          </CardTitle>
          <ClipboardCheck className="h-4 w-4 text-white/90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-white/80">
            (Static Data)
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Last Visit</CardTitle>
          <Clock className="h-4 w-4 text-white/90" />
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-7 w-32 bg-white/20" /> : (
            <div className="text-2xl font-bold">
              {lastVisit ? format(new Date(lastVisit.dateTime), "MMM d, yyyy") : 'N/A'}
            </div>
          )}
          <p className="text-xs text-white/80">
            {lastVisit ? `with ${lastVisit.doctorName}` : 'No completed visits yet.'}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Outstanding Bills</CardTitle>
          <span className="h-4 w-4 text-white/90 font-bold">GH₵</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">GH₵150.00</div>
          <p className="text-xs text-white/80">
            (Static Data)
          </p>
        </CardContent>
      </Card>
    </div>
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
       <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Here are your scheduled appointments.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/appointments">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-40 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : upcomingAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">No upcoming appointments.</TableCell>
                </TableRow>
              ) : (
                upcomingAppointments.slice(0, 3).map((appointment) => (
                 <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{appointment.doctorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.service}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell className="text-right">{appointment.dateTime}</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Visits</CardTitle>
            <CardDescription>
              Summary of your recent completed appointments.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/appointments">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
           {loading ? (
             [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              ))
           ) : recentVisits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent visits.</p>
           ) : (
              recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={`https://placehold.co/40x40.png`} alt="Avatar" data-ai-hint="doctor avatar" />
                        <AvatarFallback>{visit.doctorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{visit.service}</p>
                    <p className="text-sm text-muted-foreground">with {visit.doctorName}</p>
                    </div>
                    <div className="ml-auto font-medium text-sm">{format(new Date(visit.dateTime), "MMM d, yyyy")}</div>
                </div>
              ))
           )}
        </CardContent>
      </Card>
    </div>
  </>
  )
}
