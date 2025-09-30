
"use client"
import * as React from "react"
import { Check, MoreHorizontal, Video, X, Link as LinkIcon } from "lucide-react"
import { doc, updateDoc, getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import type { TelemedicineSession } from "@/lib/types";

export default function AdminTelemedicinePage() {
    const [sessions, setSessions] = React.useState<TelemedicineSession[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
    const [selectedSession, setSelectedSession] = React.useState<TelemedicineSession | null>(null);
    const [meetingLink, setMeetingLink] = React.useState("");
    const { toast } = useToast();

    const fetchSessions = React.useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "telemedicine"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TelemedicineSession));
            setSessions(data);
        } catch (error) {
            console.error("Error fetching sessions: ", error);
            toast({ title: "Error", description: "Could not fetch telemedicine sessions.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);
    
    const handleStatusUpdate = async (sessionId: string, status: TelemedicineSession['status']) => {
        const sessionRef = doc(db, "telemedicine", sessionId);
        try {
            await updateDoc(sessionRef, { status });
            setSessions(sessions.map(s => s.id === sessionId ? {...s, status} : s));
            toast({ title: "Status Updated", description: `Session has been marked as ${status}.` });
        } catch(e) {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    }

    const openLinkDialog = (session: TelemedicineSession) => {
        setSelectedSession(session);
        setMeetingLink(session.sessionLink || "");
        setIsLinkDialogOpen(true);
    };

    const handleApproveWithLink = async () => {
        if (!selectedSession || !meetingLink) return;
        const sessionRef = doc(db, "telemedicine", selectedSession.id);
        try {
            await updateDoc(sessionRef, {
                status: 'Scheduled',
                sessionLink: meetingLink
            });
            
            setSessions(sessions.map(s => s.id === selectedSession.id ? {...s, status: 'Scheduled', sessionLink: meetingLink } : s));

            toast({ title: "Session Approved", description: "The session is now scheduled with the meeting link." });
            setIsLinkDialogOpen(false);
            setSelectedSession(null);
            setMeetingLink("");
        } catch (e) {
            toast({ title: "Error", description: "Could not approve session.", variant: "destructive" });
        }
    }

    const renderTable = (data: TelemedicineSession[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? [...Array(3)].map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full"/></TableCell></TableRow>
                )) : data.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24">No sessions in this category.</TableCell></TableRow>
                ) : data.map((session) => (
                    <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.patientName}</TableCell>
                        <TableCell>{session.doctorName}</TableCell>
                        <TableCell>{format(parseISO(session.dateTime.split(' ')[0]), 'PPP')} at {session.dateTime.split(' ')[1]}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="capitalize">{session.platform.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={session.status === "Scheduled" ? "default" : session.status === "Canceled" ? "destructive" : "secondary"}>{session.status}</Badge>
                        </TableCell>
                        <td className="text-right">
                           {session.status === 'Requested' && (
                             <Button size="sm" className="gap-2" onClick={() => openLinkDialog(session)}>
                                <Check className="h-4 w-4" /> Approve
                             </Button>
                           )}
                           {session.status === 'Scheduled' && (
                             <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => window.open(session.sessionLink, '_blank')}><Video className="h-4 w-4" /></Button>
                                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(session.id, 'Canceled')}><X className="h-4 w-4" /></Button>
                             </div>
                           )}
                        </td>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    const requested = sessions.filter(s => s.status === 'Requested');
    const scheduled = sessions.filter(s => s.status === 'Scheduled');
    const history = sessions.filter(s => s.status === 'Completed' || s.status === 'Canceled');

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Telemedicine Sessions</CardTitle>
                <CardDescription>Manage requested and scheduled virtual consultations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="requested">
                    <TabsList>
                        <TabsTrigger value="requested">Requested</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="requested" className="mt-4">{renderTable(requested)}</TabsContent>
                    <TabsContent value="scheduled" className="mt-4">{renderTable(scheduled)}</TabsContent>
                    <TabsContent value="history" className="mt-4">{renderTable(history)}</TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Session & Add Link</DialogTitle>
                    <DialogDescription>
                        Provide the meeting link to schedule this session. The patient will be notified.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="meeting-link">Meeting Link (Google Meet, WhatsApp, etc.)</Label>
                        <Input 
                            id="meeting-link" 
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="https://meet.google.com/xyz-abc-def"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApproveWithLink}>Approve & Save Link</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}
