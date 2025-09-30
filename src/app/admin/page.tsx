
"use client"
import Link from "next/link"
import * as React from "react"
import {
  Activity,
  ArrowUpRight,
  Users,
  Calendar
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { collection, getDocs, query, orderBy, where, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";


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
import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment } from "@/app/admin/appointments/page";
import type { Doctor } from "@/lib/types";


interface WeeklyAppointmentData {
    name: string;
    scheduled: number;
    completed: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [totalPatients, setTotalPatients] = React.useState(0);
  const [totalAppointments, setTotalAppointments] = React.useState(0);
  const [doctorsOnline, setDoctorsOnline] = React.useState(0);
  const [totalDoctors, setTotalDoctors] = React.useState(0);
  const [recentAppointments, setRecentAppointments] = React.useState<Appointment[]>([]);
  const [weeklyChartData, setWeeklyChartData] = React.useState<WeeklyAppointmentData[]>([]);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
        setLoading(true);
        
        try {
            const appointmentsQuery = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
            const doctorsQuery = query(collection(db, "doctors"), orderBy("name"));
            const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
            
            const [appointmentsSnapshot, doctorsSnapshot, patientsSnapshot] = await Promise.all([
                getDocs(appointmentsQuery),
                getDocs(doctorsQuery),
                getDocs(patientsQuery)
            ]);
            
            const appointmentsData = appointmentsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                     id: doc.id,
                     ...data,
                     createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                } as Appointment
            });

            const doctorsData = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
            
            setTotalPatients(patientsSnapshot.size);
            setTotalAppointments(appointmentsData.length);
            setRecentAppointments(appointmentsData.slice(0, 5));

            setTotalDoctors(doctorsData.length);
            setDoctorsOnline(doctorsData.filter(d => d.status === 'Online').length);

            // Process chart data from fetched appointments
            const today = new Date();
            const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
            const end = endOfWeek(today, { weekStartsOn: 1 });
            const weekDays = eachDayOfInterval({ start, end });

            const data: WeeklyAppointmentData[] = weekDays.map(day => ({
                name: format(day, 'EEE'),
                scheduled: 0,
                completed: 0,
            }));

            appointmentsData.forEach(appt => {
                const apptDate = new Date(appt.createdAt);
                if (apptDate >= start && apptDate <= end) {
                    const dayIndex = weekDays.findIndex(day => isSameDay(day, apptDate));
                    if (dayIndex !== -1) {
                        data[dayIndex].scheduled += 1;
                        if (appt.status === 'Completed') {
                            data[dayIndex].completed += 1;
                        }
                    }
                }
            });
            setWeeklyChartData(data);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              Total Revenue
            </CardTitle>
            <span className="h-4 w-4 text-white/90 font-bold">GH₵</span>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-32 bg-white/20" /> : <div className="text-2xl font-bold">GH₵45,231.89</div>}
            <p className="text-xs text-white/80">
              (Static Data)
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-20 bg-white/20" /> : <div className="text-2xl font-bold">{totalPatients}</div>}
            <p className="text-xs text-white/80">
              Live patient count
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-20 bg-white/20" /> : <div className="text-2xl font-bold">{totalAppointments}</div>}
            <p className="text-xs text-white/80">
              All time appointments
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-400 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Doctors Online</CardTitle>
            <Activity className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-24 bg-white/20" /> : <div className="text-2xl font-bold">{doctorsOnline} / {totalDoctors}</div>}
            <p className="text-xs text-white/80">
              Live status
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Appointments This Week</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? <Skeleton className="h-[350px] w-full" /> : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyChartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="scheduled" name="Scheduled" fill="hsl(var(--primary))" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              {loading ? <Skeleton className="h-5 w-48" /> : `Showing the ${recentAppointments.length} most recent appointments.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                        </TableRow>
                    )) : recentAppointments.map(appt => (
                         <TableRow key={appt.id}>
                            <TableCell>
                                <div className="font-medium">{appt.patientName}</div>
                                <div className="text-sm text-muted-foreground">{appt.patientEmail}</div>
                            </TableCell>
                             <TableCell>{appt.doctorName}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={appt.status === "Completed" ? "default" : appt.status === "Canceled" ? "destructive" : "secondary"}>{appt.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
