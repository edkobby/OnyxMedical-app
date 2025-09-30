
"use client"
import React, { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { servicesList, Service } from "@/lib/content-data"
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { Stethoscope, Trash2, PlusCircle } from "lucide-react";

interface EditableService extends Service {
    id: string;
}

const serviceIconMap: { [key: string]: LucideIcon } = servicesList.reduce((acc, service) => {
    acc[service.title.toLowerCase().replace(/ /g, '-')] = service.icon;
    return acc;
}, {} as { [key: string]: LucideIcon });


export default function AdminContentPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const [heroContent, setHeroContent] = useState({ headline: "", subtext: "" });
  const [aboutContent, setAboutContent] = useState({ beginning: "", commitment: "", mission: "", vision: "" });
  const [services, setServices] = useState<EditableService[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
        setLoading(true);
        try {
            const contentDocRef = doc(db, "content", "website");
            const contentDocSnap = await getDoc(contentDocRef);

            if (contentDocSnap.exists()) {
                const data = contentDocSnap.data();
                setHeroContent(data.hero || { headline: "", subtext: "" });
                setAboutContent(data.about || { beginning: "", commitment: "", mission: "", vision: "" });
                if (data.services) {
                    const fetchedServices = data.services?.map((s: any) => ({
                      ...s,
                      icon: serviceIconMap[s.id] || Stethoscope,
                    })) || [];
                    setServices(fetchedServices);
                } else {
                   const initialServices = servicesList.map(s => ({...s, id: s.title.toLowerCase().replace(/ /g, '-')}));
                   setServices(initialServices);
                   // Save initial services to DB if they don't exist
                   await setDoc(contentDocRef, { services: initialServices }, { merge: true });
                }
            } else {
                // Document doesn't exist, create it with all default content
                const initialServices = servicesList.map(s => ({...s, id: s.title.toLowerCase().replace(/ /g, '-')}));
                setServices(initialServices);
                const defaultContent = {
                  hero: { headline: "Your Health is Our Priority", subtext: "Providing compassionate, comprehensive, and high-quality medical care for every stage of life." },
                  about: { beginning: "", commitment: "", mission: "", vision: "" },
                  services: initialServices
                }
                await setDoc(contentDocRef, defaultContent);
            }
        } catch (error) {
             toast({
                title: "Error fetching content",
                description: "Could not retrieve website content from Firestore.",
                variant: "destructive"
            });
        }
        setLoading(false);
    }
    fetchContent();
  }, [toast]);

  const handleSave = async (section: string, data: any) => {
    setIsSubmitting(true);
    try {
      const contentDocRef = doc(db, "content", "website");
      await setDoc(contentDocRef, { [section]: data }, { merge: true });
       toast({
        title: "Content Saved",
        description: `The ${section} section has been updated successfully.`,
      });
    } catch(error) {
         toast({
            title: "Save Failed",
            description: "There was an error saving the content.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  const handleServiceChange = (index: number, field: 'title' | 'description', value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServices(newServices);
  };

  const handleAddService = () => {
    const newService: EditableService = {
      id: `new-service-${Date.now()}`,
      title: 'New Service Title',
      description: 'A brief description of the new service.',
      icon: Stethoscope, // Default icon
    };
    setServices([...services, newService]);
  };

  const handleDeleteService = (indexToDelete: number) => {
    const newServices = services.filter((_, index) => index !== indexToDelete);
    setServices(newServices);
  };
  
  if (loading) {
    return (
        <Card>
            <CardHeader><CardTitle><Skeleton className="h-8 w-64" /></CardTitle><CardDescription><Skeleton className="h-4 w-80" /></CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Update content across the public-facing website. Changes will be live upon saving.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">Homepage Hero Section</AccordionTrigger>
              <AccordionContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('hero', heroContent); }} className="grid gap-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="hero-headline">Headline</Label>
                        <Input id="hero-headline" name="headline" value={heroContent.headline} onChange={(e) => setHeroContent({...heroContent, headline: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero-subtext">Subtext</Label>
                        <Textarea id="hero-subtext" name="subtext" value={heroContent.subtext} onChange={(e) => setHeroContent({...heroContent, subtext: e.target.value})} />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Hero Section'}</Button>
                </form>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">About Us Page</AccordionTrigger>
              <AccordionContent>
                 <form onSubmit={(e) => { e.preventDefault(); handleSave('about', aboutContent); }} className="grid gap-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="about-story-beginning">Our Humble Beginning</Label>
                        <Textarea id="about-story-beginning" name="beginning" rows={4} value={aboutContent.beginning} onChange={(e) => setAboutContent({...aboutContent, beginning: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="about-story-commitment">Our Commitment to Excellence</Label>
                        <Textarea id="about-story-commitment" name="commitment" rows={4} value={aboutContent.commitment} onChange={(e) => setAboutContent({...aboutContent, commitment: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="about-mission">Our Mission</Label>
                        <Textarea id="about-mission" name="mission" rows={2} value={aboutContent.mission} onChange={(e) => setAboutContent({...aboutContent, mission: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="about-vision">Our Vision & Plan</Label>
                        <Textarea id="about-vision" name="vision" rows={2} value={aboutContent.vision} onChange={(e) => setAboutContent({...aboutContent, vision: e.target.value})} />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save About Us Content'}</Button>
                 </form>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">Services List</AccordionTrigger>
              <AccordionContent>
                 <div className="grid gap-6 pt-4">
                    {services.map((service, index) => {
                      const Icon = service.icon;
                      return (
                        <div key={service.id} className="p-4 border rounded-lg space-y-4 bg-secondary/50 relative">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7"
                                onClick={() => handleDeleteService(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete service</span>
                            </Button>
                            <div className="flex items-start gap-4 pr-10">
                                {Icon && <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-2" />}
                                <div className="flex-grow space-y-2">
                                    <div>
                                        <Label htmlFor={`service-title-${index}`}>Service Title</Label>
                                        <Input 
                                            id={`service-title-${index}`} 
                                            value={service.title} 
                                            onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`service-desc-${index}`}>Description</Label>
                                        <Textarea 
                                            id={`service-desc-${index}`} 
                                            value={service.description} 
                                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                    <div className="flex justify-between items-center mt-4">
                        <Button variant="outline" onClick={handleAddService}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
                        </Button>
                        <Button 
                            onClick={() => handleSave('services', services.map(({icon, ...rest}) => ({...rest, id: rest.title.toLowerCase().replace(/ /g, '-')})))}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Services List'}
                        </Button>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
