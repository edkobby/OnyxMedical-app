
"use client"
import * as React from "react"
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { doc, updateDoc, serverTimestamp, addDoc, collection, getDocs, query, where, orderBy, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export interface Patient {
    id: string; 
    uid: string;
    name: string;
    email: string;
    phone?: string;
    photoURL?: string;
    createdAt?: string; // Serialized
    lastVisit?: string; // Serialized
    status: 'Active' | 'Inactive';
    role: 'patient' | 'admin'
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const fetchPatients = React.useCallback(async () => {
        setLoading(true);
        try {
            const patientsRef = collection(db, "users");
            const q = query(patientsRef, where("role", "==", "patient"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const patientsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
                    lastVisit: data.lastVisit?.toDate ? data.lastVisit.toDate().toISOString() : null,
                } as Patient;
            });
            setPatients(patientsData);
        } catch(error) {
            console.error("Error fetching patients:", error);
            toast({
                title: "Error fetching data",
                description: "Could not retrieve patient list. Check console and permissions.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const patientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };
    
    // NOTE: This function creates a user record in Firestore but NOT a Firebase Auth user.
    // This is for manual entry of patients who may not have login access.
    // For users to log in, they must register through the standard auth form.
    try {
        await addDoc(collection(db, "users"), {
            ...patientData,
            role: "patient",
            status: "Active",
            lastVisit: null,
            createdAt: serverTimestamp(),
            // A UID is not created here as no auth user is being created.
            uid: `manual_${Date.now()}` 
        });
        toast({
            title: "Patient Added",
            description: `${patientData.name} has been added to the system.`,
        });
        setIsDialogOpen(false);
        fetchPatients();
    } catch (error) {
        console.error("Error adding patient: ", error);
        toast({
            title: "Error",
            description: "Could not add the patient. Please try again.",
            variant: "destructive"
        });
    }
  };
  
  const handleDeactivate = async (patientId: string) => {
    const patientRef = doc(db, "users", patientId);
    try {
        await updateDoc(patientRef, { status: 'Inactive' });
        setPatients(patients.map(p => p.id === patientId ? {...p, status: 'Inactive'} : p));
        toast({
            title: "Patient Deactivated",
            description: "The patient's status has been set to Inactive.",
        });
    } catch(error) {
         toast({
            title: "Error",
            description: "Could not update patient status. Please try again.",
            variant: "destructive"
        });
    }
  }

  const renderPatientsTable = (patientsToShow: Patient[]) => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Registered Date</TableHead>
              <TableHead className="hidden md:table-cell">Last Visit</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-48"/></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto"/></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto"/></TableCell>
                    </TableRow>
                ))
            ) : patientsToShow.length === 0 ? (
               <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No patients found in this category.</TableCell>
              </TableRow>
            ) : (
                patientsToShow.map((patient) => (
                <TableRow key={patient.id}>
                    <TableCell>
                    <div className="font-medium">{patient.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                        {patient.email}
                    </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {patient.createdAt ? format(new Date(patient.createdAt), "PPP") : 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {patient.lastVisit ? format(new Date(patient.lastVisit), "PPP") : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                    <Badge variant={patient.status === "Active" ? "default" : "destructive"}>
                        {patient.status}
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
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/patients/${patient.id}`}>View Profile</Link>
                        </DropdownMenuItem>
                        {patient.status !== 'Inactive' && (
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(patient.id)}>Deactivate</DropdownMenuItem>
                        )}
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

  const active = patients.filter(p => p.status === 'Active');
  const inactive = patients.filter(p => p.status === 'Inactive');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">
            Manage all registered patients in the system.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Patient Manually
        </Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {renderPatientsTable(patients)}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {renderPatientsTable(active)}
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          {renderPatientsTable(inactive)}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Patient Manually</DialogTitle>
            <DialogDescription>
              Enter the details for the new patient. This will create a patient record but not a login account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
