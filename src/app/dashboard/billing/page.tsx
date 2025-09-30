
"use client"
import * as React from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";

import { FileDown, DollarSign } from "lucide-react";
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
import DashboardHeader from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Invoice {
    id: string;
    patientId: string;
    patientName: string;
    serviceId: string;
    serviceName: string;
    amount: number;
    status: 'Due' | 'Paid' | 'Overdue';
    createdAt: any;
    dueDate: any;
}

export default function DashboardBilling() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [payingInvoiceId, setPayingInvoiceId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    const q = query(
        collection(db, "invoices"),
        where("patientId", "==", user.uid),
        orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const invoicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        setInvoices(invoicesData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching invoices:", error);
        toast({ title: "Error", description: "Could not fetch your invoices.", variant: "destructive" });
        setLoading(false);
    });
    return () => unsubscribe();
  }, [user, toast]);
  
  const handlePayNow = async (invoice: Invoice) => {
    if (!user || !user.email) {
        toast({ title: "Error", description: "You must be logged in to pay.", variant: "destructive"});
        return;
    }
    setPayingInvoiceId(invoice.id);
    try {
        const response = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                amount: invoice.amount * 100, // Paystack expects amount in kobo
                invoiceId: invoice.id
            }),
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = data.authorization_url;
        } else {
            throw new Error(data.message || 'Failed to initialize payment.');
        }
    } catch (error: any) {
        console.error("Payment initialization failed:", error);
        toast({ title: "Payment Error", description: error.message, variant: "destructive" });
    } finally {
        setPayingInvoiceId(null);
    }
  };

  const getStatusVariant = (status: Invoice['status']) => {
    if (status === 'Paid') return 'default';
    if (status === 'Overdue') return 'destructive';
    return 'secondary';
  }

  return (
    <>
      <DashboardHeader title="Billing & Payments" description="View your invoices and payment history." />
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>A list of all your past and present invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 [...Array(3)].map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full"/></TableCell></TableRow>)
              ) : invoices.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="h-24 text-center">No invoices found.</TableCell></TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">#{invoice.id.substring(0, 7)}</TableCell>
                    <TableCell>{invoice.createdAt ? format(invoice.createdAt.toDate(), "PPP") : 'N/A'}</TableCell>
                    <TableCell>{invoice.serviceName}</TableCell>
                    <TableCell>GH₵{invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <td className="text-right flex gap-2 justify-end">
                      {invoice.status === 'Due' && (
                        <Button size="sm" onClick={() => handlePayNow(invoice)} disabled={payingInvoiceId === invoice.id}>
                          {payingInvoiceId === invoice.id ? 'Processing...' : 'Pay Now'}
                        </Button>
                      )}
                      <Button size="sm" variant="outline"><FileDown className="h-4 w-4" /></Button>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
