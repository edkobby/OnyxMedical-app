
"use client"
import * as React from "react"
import { collection, addDoc, doc, deleteDoc, updateDoc, serverTimestamp, getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { PlusCircle, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient } from "@/app/admin/patients/page";

interface Service {
    id: string;
    name: string;
    price: number;
}

interface Invoice {
    id: string;
    patientId: string;
    patientName: string;
    serviceId: string;
    serviceName: string;
    amount: number;
    status: 'Due' | 'Paid' | 'Overdue';
    createdAt: string; // Serialized
    dueDate: string; // Serialized
}

export default function AdminBillingPage() {
    const { toast } = useToast();
    
    // Services State
    const [services, setServices] = React.useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = React.useState(true);
    const [isServiceDialogOpen, setIsServiceDialogOpen] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState<Service | null>(null);

    // Invoices State
    const [invoices, setInvoices] = React.useState<Invoice[]>([]);
    const [loadingInvoices, setLoadingInvoices] = React.useState(true);
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = React.useState(false);
    
    // Patients state for invoice creation
    const [patients, setPatients] = React.useState<Patient[]>([]);

    const fetchData = React.useCallback(async () => {
        setLoadingInvoices(true);
        setLoadingServices(true);
        try {
            const invoicesQuery = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
            const servicesQuery = query(collection(db, "billable_services"), orderBy("name"));
            const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));

            const [invoicesSnapshot, servicesSnapshot, patientsSnapshot] = await Promise.all([
                getDocs(invoicesQuery),
                getDocs(servicesQuery),
                getDocs(patientsQuery)
            ]);

            const invoicesData = invoicesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                    dueDate: data.dueDate?.toDate ? data.dueDate.toDate().toISOString() : new Date().toISOString(),
                } as Invoice
            });
            const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            const patientsData = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));

            setInvoices(invoicesData);
            setServices(servicesData);
            setPatients(patientsData);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not fetch billing data.", variant: "destructive" });
        } finally {
            setLoadingInvoices(false);
            setLoadingServices(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const serviceData = {
            name: formData.get('name') as string,
            price: Number(formData.get('price')),
        };

        try {
            if (selectedService) {
                await updateDoc(doc(db, "billable_services", selectedService.id), serviceData);
                toast({ title: "Service Updated" });
            } else {
                await addDoc(collection(db, "billable_services"), serviceData);
                toast({ title: "Service Added" });
            }
            setIsServiceDialogOpen(false);
            setSelectedService(null);
            fetchData(); // Refresh data
        } catch (error) {
            toast({ title: "Error", description: "Could not save service.", variant: "destructive" });
        }
    };

    const handleInvoiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const patientId = formData.get('patientId') as string;
        const serviceId = formData.get('serviceId') as string;
        
        const selectedPatient = patients.find(p => p.id === patientId);
        const selectedService = services.find(s => s.id === serviceId);

        if (!selectedPatient || !selectedService) {
            toast({ title: "Error", description: "Invalid patient or service selected.", variant: "destructive"});
            return;
        }

        const invoiceData = {
            patientId: selectedPatient.id,
            patientName: selectedPatient.name,
            patientEmail: selectedPatient.email,
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            amount: selectedService.price,
            status: 'Due' as Invoice['status'],
            createdAt: serverTimestamp(),
            dueDate: serverTimestamp(), // Placeholder, can be improved
        };
        
        try {
            await addDoc(collection(db, "invoices"), invoiceData);

            await addDoc(collection(db, "notifications"), {
              recipientId: "admin",
              title: "Invoice Created",
              description: `An invoice for ${selectedService.name} was created for ${selectedPatient.name}.`,
              type: "new_invoice",
              read: false,
              createdAt: serverTimestamp(),
            });

            toast({ title: "Invoice Created", description: `Invoice for ${selectedPatient.name} has been created.`});
            setIsInvoiceDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Could not create invoice.", variant: "destructive"});
        }
    };
    
    const handleUpdateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
        try {
            await updateDoc(doc(db, "invoices", invoiceId), { status });
            setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status } : inv));
            toast({ title: "Invoice Status Updated", description: `Invoice marked as ${status}.`});
        } catch (error) {
            toast({ title: "Error", description: "Could not update invoice status.", variant: "destructive"});
        }
    };
    
    const handleDeleteInvoice = async (invoiceId: string) => {
        if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, "invoices", invoiceId));
            setInvoices(invoices.filter(inv => inv.id !== invoiceId));
            toast({ title: "Invoice Deleted"});
        } catch (error) {
            toast({ title: "Error", description: "Could not delete invoice.", variant: "destructive"});
        }
    }

    const handleDeleteService = async (serviceId: string) => {
        if(window.confirm("Are you sure? This will delete the service permanently.")) {
            await deleteDoc(doc(db, "billable_services", serviceId));
            setServices(services.filter(s => s.id !== serviceId));
            toast({ title: "Service Deleted" });
        }
    }

    const getStatusVariant = (status: Invoice['status']) => {
        if (status === 'Paid') return 'default';
        if (status === 'Overdue') return 'destructive';
        return 'secondary';
    }

    return (
        <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold tracking-tight">Billing</CardTitle>
                <CardDescription>Manage services, pricing, and patient invoices.</CardDescription>
            </CardHeader>

            <Tabs defaultValue="invoices" className="w-full">
                <TabsList>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="services">Services & Pricing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="invoices">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Invoices</CardTitle>
                            <div className="flex justify-between items-center">
                                <CardDescription>A log of all generated invoices.</CardDescription>
                                <Button size="sm" onClick={() => setIsInvoiceDialogOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date Issued</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingInvoices ? (
                                        [...Array(3)].map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full"/></TableCell></TableRow>)
                                    ) : invoices.map(invoice => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">{invoice.patientName}</TableCell>
                                            <TableCell>{invoice.serviceName}</TableCell>
                                            <TableCell>GH₵{invoice.amount.toFixed(2)}</TableCell>
                                            <TableCell>{format(new Date(invoice.createdAt), 'PPP')}</TableCell>
                                            <TableCell><Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleUpdateInvoiceStatus(invoice.id, 'Paid')}>Mark as Paid</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateInvoiceStatus(invoice.id, 'Due')}>Mark as Due</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)} className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="services">
                    <Card>
                        <CardHeader>
                            <CardTitle>Services & Pricing</CardTitle>
                             <div className="flex justify-between items-center">
                                <CardDescription>Manage all billable services and their costs.</CardDescription>
                                <Button size="sm" onClick={() => { setSelectedService(null); setIsServiceDialogOpen(true); }}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service Name</TableHead>
                                        <TableHead>Price (GH₵)</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingServices ? (
                                        [...Array(3)].map((_, i) => <TableRow key={i}><TableCell colSpan={3}><Skeleton className="h-8 w-full"/></TableCell></TableRow>)
                                    ) : services.map(service => (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium">{service.name}</TableCell>
                                            <TableCell>{service.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => { setSelectedService(service); setIsServiceDialogOpen(true); }}>
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteService(service.id)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            {/* Service Dialog */}
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedService ? "Edit Service" : "Add New Service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name</Label>
                            <Input id="name" name="name" defaultValue={selectedService?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (GH₵)</Label>
                            <Input id="price" name="price" type="number" step="0.01" defaultValue={selectedService?.price} required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Service</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {/* Invoice Dialog */}
            <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                        <div className="space-y-2">
                           <Label>Select Patient</Label>
                           <Select name="patientId" required>
                               <SelectTrigger><SelectValue placeholder="Choose a patient..." /></SelectTrigger>
                               <SelectContent>
                                   {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                               </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label>Select Service</Label>
                           <Select name="serviceId" required>
                               <SelectTrigger><SelectValue placeholder="Choose a service..." /></SelectTrigger>
                               <SelectContent>
                                   {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - GH₵{s.price.toFixed(2)}</SelectItem>)}
                               </SelectContent>
                           </Select>
                        </div>
                        <DialogFooter>
                             <Button type="button" variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>Cancel</Button>
                             <Button type="submit">Create Invoice</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
