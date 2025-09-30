
"use client"
import Link from "next/link"
import * as React from "react"
import { PlusCircle, Video } from "lucide-react"
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/auth-context";

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
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TelemedicineSession {
    id: string;
    doctorName: string;
    dateTime: string;
    platform: 'whatsapp' | 'google_meet';
    status: 'Requested' | 'Scheduled' | 'Completed' | 'Canceled';
    sessionLink?: string;
}

export default function DashboardTelemedicine() {
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState<TelemedicineSession[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    const q = query(
        collection(db, "telemedicine"), 
        where("patientId", "==", user.uid),
        orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TelemedicineSession));
        setSessions(sessionsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching telemedicine sessions: ", error);
        toast({ title: "Error", description: "Could not fetch your sessions.", variant: "destructive"});
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleJoin = (session: TelemedicineSession) => {
    if (session.status === 'Scheduled' && session.sessionLink) {
        window.open(session.sessionLink, '_blank');
    } else {
        toast({
            title: "Session Not Ready",
            description: "The meeting link is not available yet. Please check back later.",
            variant: "default"
        })
    }
  }
  
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Scheduled': return 'default';
        case 'Requested': return 'secondary';
        case 'Canceled': return 'destructive';
        case 'Completed': return 'outline';
        default: return 'secondary';
    }
  }


  return (
    <>
      <div className="flex items-center justify-between">
         <DashboardHeader title="Telemedicine" description="Access virtual consultations from the comfort of your home." />
        <Button asChild size="sm" className="gap-1">
          <Link href="/telemedicine">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Request Consultation
            </span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Virtual Consultations</CardTitle>
          <CardDescription>Your requested and scheduled video appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="hidden md:table-cell">Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                        <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24"/></TableCell>
                        <TableCell><Skeleton className="h-6 w-24"/></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto"/></TableCell>
                    </TableRow>
                ))
              ) : sessions.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No virtual consultations found.</TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                    <TableRow key={session.id}>
                    <TableCell className="font-medium hidden sm:table-cell">{session.doctorName}</TableCell>
                    <TableCell>
                      <div className="font-medium sm:hidden">{session.doctorName}</div>
                      <div className="text-sm text-muted-foreground">{format(parseISO(session.dateTime.split(' ')[0]), 'PPP')} at {session.dateTime.split(' ')[1]}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="capitalize">{session.platform.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(session.status)}>{session.status}</Badge>
                    </TableCell>
                    <td className="text-right">
                        <Button 
                            size="sm" 
                            className="gap-2"
                            disabled={session.status !== 'Scheduled'}
                            onClick={() => handleJoin(session)}
                        >
                            <Video className="h-4 w-4"/> Join
                        </Button>
                    </td>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
