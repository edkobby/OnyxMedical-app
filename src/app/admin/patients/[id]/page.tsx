
"use client"
import * as React from "react"
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Edit, Mail, Phone, Calendar, MoreVertical } from "lucide-react"
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { format } from "date-fns";

import type { Appointment } from "@/app/admin/appointments/page";
import type { Patient } from "@/app/admin/patients/page";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton";


export default function PatientProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const patientDocRef = doc(db, "users", id);
        const patientDocSnap = await getDoc(patientDocRef);

        if (!patientDocSnap.exists()) {
            notFound();
        }
        
        const patientData = { 
            id: patientDocSnap.id, 
            ...patientDocSnap.data(),
            createdAt: patientDocSnap.data().createdAt?.toDate ? patientDocSnap.data().createdAt.toDate().toISOString() : null,
        } as Patient;
        setPatient(patientData);

        // Use patientId (which is the uid) to query appointments
        const apptQuery = query(collection(db, "appointments"), where("patientId", "==", patientData.uid));
        const apptQuerySnapshot = await getDocs(apptQuery);
        const appointmentsData = apptQuerySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }) as Appointment);
        setAppointments(appointmentsData);

      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    
    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                 <Skeleton className="h-9 w-9" />
                 <Skeleton className="h-7 w-48" />
                 <Skeleton className="h-7 w-20 ml-auto" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle><CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription></CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center gap-4"><Skeleton className="h-20 w-20 rounded-full" /><Skeleton className="h-8 w-32" /></div>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle><Skeleton className="h-8 w-1/2" /></CardTitle></CardHeader>
                    <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                </Card>
            </div>
        </div>
    )
  }

  if (!patient) {
    return notFound();
  }

  const formatDateSafe = (date?: any) => {
    if (!date) return 'N/A';
    try {
        return format(new Date(date), 'PPP');
    } catch (e) {
        return 'Invalid Date';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/patients">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to patients</span>
            </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {patient.name}
        </h1>
        <Badge variant={patient.status === 'Active' ? 'default' : 'destructive'} className="ml-auto sm:ml-0">
          {patient.status}
        </Badge>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Patient</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Deactivate Patient</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
            <CardDescription>Contact and registration information.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
                <Image
                  alt="Patient avatar"
                  className="rounded-full object-cover"
                  height={80}
                  src={patient.photoURL || `https://placehold.co/80x80.png`}
                  data-ai-hint="person avatar"
                  width={80}
                />
                <div className="font-semibold text-lg">{patient.name}</div>
            </div>
             <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">{patient.email}</span>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">{patient.phone || '(123) 456-7890'}</span>
            </div>
             <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Registered: {formatDateSafe(patient.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length > 0 ? appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.doctorName}</TableCell>
                    <TableCell>{appt.service}</TableCell>
                    <TableCell>{appt.dateTime}</TableCell>
                    <TableCell>
                      <Badge
                        variant={appt.status === "Completed" ? "default" : appt.status === "Canceled" ? "destructive" : "secondary"}
                      >
                        {appt.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No appointment history found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
