

"use client"
import * as React from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase"; 
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';

interface Service {
    id: string;
    name: string;
    price: number;
}

export default function PricingPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
        setLoading(true);
        try {
            const servicesCollection = collection(db, "billable_services");
            const q = query(servicesCollection, orderBy("price"));
            const querySnapshot = await getDocs(q);
            const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            setServices(servicesData);
        } catch (error) {
            console.error("Error fetching services: ", error);
        } finally {
            setLoading(false);
        }
    }
    fetchServices();
  }, []);

  const fertilityServices = services.filter(s => s.name.toLowerCase().includes('fertility') || s.name.toLowerCase().includes('ivf'));
  const generalServices = services.filter(s => !s.name.toLowerCase().includes('fertility') && !s.name.toLowerCase().includes('ivf'));

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Our Pricing" imageSrc="/images/hero/black-woman-phone-call-pharmacist-writing-notebook-telehealth-consultation-pharmacy-happy-african-female-person-medical-healthcare-professional-talk-min.jpg" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pricing' }]} />
        
        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline uppercase text-foreground">Transparent & Affordable Pricing</h2>
                    <p className="max-w-3xl text-muted-foreground md:text-xl">
                        We believe in clear and honest pricing. Below is a list of our common services. For a detailed quote or services not listed, please contact us.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mt-16">
                     <Card>
                        <CardHeader>
                            <CardTitle>General Medical Services</CardTitle>
                            <CardDescription>Pricing for routine consultations and procedures.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead className="text-right">Price (GH₵)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        generalServices.map(service => (
                                            <TableRow key={service.id}>
                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                <TableCell className="text-right">{service.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary">
                        <CardHeader>
                            <CardTitle>Fertility & IVF Services</CardTitle>
                            <CardDescription>Specialized pricing for fertility treatments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead className="text-right">Price (GH₵)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        fertilityServices.map(service => (
                                            <TableRow key={service.id}>
                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                <TableCell className="text-right">{service.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                             <div className="mt-6 text-center">
                                <Button asChild variant="accent">
                                    <Link href="/appointment">Book a Fertility Consultation</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="mt-16 text-center text-muted-foreground">
                    <p>Prices are subject to change. Please confirm with the front desk at the time of your visit.</p>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
