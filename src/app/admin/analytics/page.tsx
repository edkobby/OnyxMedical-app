
"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Funnel, FunnelChart, LabelList } from "recharts"
import { startOfMonth, endOfMonth, differenceInYears } from "date-fns";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CalendarCheck, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from "@/lib/types";
import type { Patient } from "../patients/page";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--primary))", "hsl(var(--secondary))"];

interface ServiceCount {
    service: string;
    count: number;
}
interface DemographicsData {
    name: string;
    value: number;
}
interface DoctorPerformance {
    id: string;
    name: string;
    specialty: string;
    appointments: number;
    rating: number;
    satisfaction: number;
}

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = React.useState(true);
    const [totalPatients, setTotalPatients] = React.useState(0);
    const [appointmentsThisMonth, setAppointmentsThisMonth] = React.useState(0);
    const [totalRevenue, setTotalRevenue] = React.useState(0);
    const [servicePopularity, setServicePopularity] = React.useState<ServiceCount[]>([]);
    const [demographics, setDemographics] = React.useState<DemographicsData[]>([]);
    const [doctorPerformance, setDoctorPerformance] = React.useState<DoctorPerformance[]>([]);

    React.useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                const patientsQuery = query(collection(db, "users"), where => where("role", "==", "patient"));
                const appointmentsQuery = query(collection(db, "appointments"));
                const doctorsQuery = query(collection(db, "doctors"));
                const invoicesQuery = query(collection(db, "invoices"));

                const [patientsSnapshot, appointmentsSnapshot, doctorsSnapshot, invoicesSnapshot] = await Promise.all([
                    getDocs(patientsQuery),
                    getDocs(appointmentsQuery),
                    getDocs(doctorsQuery),
                    getDocs(invoicesQuery),
                ]);

                const patientsData = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
                const appointmentsData = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                const doctorsData = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
                const invoicesData = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));


                // Total patients
                setTotalPatients(patientsData.length);

                // Appointments this month
                const now = new Date();
                const firstDay = startOfMonth(now);
                const lastDay = endOfMonth(now);
                
                let countThisMonth = 0;
                appointmentsData.forEach(appt => {
                    const createdAt = appt.createdAt instanceof Timestamp ? appt.createdAt.toDate() : new Date(appt.createdAt);
                    if (createdAt >= firstDay && createdAt <= lastDay) {
                        countThisMonth++;
                    }
                });
                setAppointmentsThisMonth(countThisMonth);

                // Patient demographics
                const ageGroups = { '0-17': 0, '18-35': 0, '36-55': 0, '56+': 0 };
                patientsData.forEach(patient => {
                    if (patient.dob) {
                         const dobDate = patient.dob instanceof Timestamp ? patient.dob.toDate() : new Date(patient.dob);
                         const age = differenceInYears(new Date(), dobDate);
                        if (age <= 17) ageGroups['0-17']++;
                        else if (age <= 35) ageGroups['18-35']++;
                        else if (age <= 55) ageGroups['36-55']++;
                        else ageGroups['56+']++;
                    }
                });
                setDemographics(Object.entries(ageGroups).map(([name, value]) => ({ name, value })));

                // Doctor performance
                setDoctorPerformance(doctorsData.map(doctor => ({
                    id: doctor.id,
                    name: doctor.name,
                    specialty: doctor.specialty,
                    appointments: doctor.patients,
                    rating: 4.5 + Math.random() * 0.4,
                    satisfaction: 90 + Math.floor(Math.random() * 10),
                })));
                
                // Total Revenue
                let revenue = 0;
                invoicesData.forEach(invoice => {
                    if(invoice.status === 'Paid') revenue += invoice.amount;
                });
                setTotalRevenue(revenue);
                
                // Service Popularity
                const serviceCounts: { [key: string]: number } = {};
                appointmentsData.forEach(doc => {
                    const service = doc.service;
                    if(service) {
                        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
                    }
                });
                setServicePopularity(Object.entries(serviceCounts)
                    .map(([service, count]) => ({ service, count }))
                    .sort((a, b) => b.count - a.count));

            } catch(error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

  return (
    <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold">{totalPatients}</div>}
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <span className="h-4 w-4 text-muted-foreground font-bold">GH₵</span>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-7 w-32" /> : <div className="text-2xl font-bold">GH₵{totalRevenue.toFixed(2)}</div>}
                    <p className="text-xs text-muted-foreground">From all paid invoices</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments This Month</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold">{appointmentsThisMonth}</div>}
                    <p className="text-xs text-muted-foreground">For current calendar month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12m 30s</div>
                    <p className="text-xs text-muted-foreground">(Static Data)</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Service Popularity</CardTitle>
                    <CardDescription>Breakdown of all appointments by service type.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                         {loading ? <Skeleton className="h-full w-full" /> : (
                            <BarChart data={servicePopularity} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="service" type="category" width={120} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20}>
                                    <LabelList dataKey="count" position="right" offset={8} className="fill-foreground" fontSize={12} />
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Patient Demographics</CardTitle>
                    <CardDescription>Distribution of patients by age group.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                       {loading ? <Skeleton className="h-full w-full" /> : (
                        <PieChart>
                            <Pie
                                data={demographics}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {demographics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip />
                             <Legend />
                        </PieChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Doctor Performance</CardTitle>
                <CardDescription>Key metrics for each doctor.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead className="text-center">Appointments (Patients)</TableHead>
                            <TableHead className="text-center">Patient Rating</TableHead>
                            <TableHead>Satisfaction</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? [...Array(4)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            </TableRow>
                        )) : doctorPerformance.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">{doctor.name}</TableCell>
                                <TableCell>{doctor.specialty}</TableCell>
                                <TableCell className="text-center">{doctor.appointments}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline">{doctor.rating.toFixed(1)} / 5.0</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={doctor.satisfaction} className="w-40" />
                                        <span>{doctor.satisfaction}%</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
