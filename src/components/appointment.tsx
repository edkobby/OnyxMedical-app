
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import { collection, addDoc, serverTimestamp, getDocs, query as firestoreQuery, orderBy, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { suggestDoctors, type SuggestDoctorsOutput } from "@/ai/flows/suggest-doctors"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Skeleton } from "./ui/skeleton"
import type { Doctor } from "@/lib/types"

const appointmentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  date: z.string().min(1, "Please select a date."),
  time: z.string().min(1, "Please select a time."),
  doctorId: z.string().optional(),
  message: z.string().max(500, "Message must not exceed 500 characters.").optional(),
  aiNeeds: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

export default function Appointment() {
  const { toast } = useToast()
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = React.useState<SuggestDoctorsOutput>([]);
  const [allDoctors, setAllDoctors] = React.useState<Doctor[]>([]);
  const [inputsDisabled, setInputsDisabled] = React.useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        doctorId: "",
        message: "",
        aiNeeds: "",
    },
  });
  
  React.useEffect(() => {
    const fetchDoctors = async () => {
        const q = firestoreQuery(collection(db, "doctors"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setAllDoctors(doctorsData);
    };
    fetchDoctors();
  }, []);

  React.useEffect(() => {
    if (user) {
        form.setValue("name", user.displayName || "");
        form.setValue("email", user.email || "");
        setInputsDisabled(true);
    } else {
        form.reset();
        setInputsDisabled(false);
    }
  }, [user, form]);
  
  const handleAiSuggestion = async () => {
      const needs = form.getValues("aiNeeds");
      if (!needs || needs.length < 10) {
          toast({
              title: "More Information Needed",
              description: "Please describe your symptoms or needs in at least 10 characters.",
              variant: "destructive"
          });
          return;
      }
      setIsAiLoading(true);
      setAiSuggestions([]);
      try {
          const suggestions = await suggestDoctors({ needs });
          setAiSuggestions(suggestions);
           if (suggestions.length > 0) {
              const suggestedDoctor = allDoctors.find(d => d.name === suggestions[0].name);
              if (suggestedDoctor) {
                 form.setValue("doctorId", suggestedDoctor.id);
              }
          }
      } catch (error) {
           toast({
              title: "AI Suggestion Failed",
              description: "Could not get suggestions at this time. Please try again.",
              variant: "destructive"
          });
          console.error("AI Suggestion Error:", error);
      } finally {
          setIsAiLoading(false);
      }
  }


  async function onSubmit(data: AppointmentFormValues) {
    if (!user) {
        toast({
            title: "Authentication Required",
            description: "Please log in or create an account to book an appointment.",
            variant: "destructive",
        });
        router.push("/auth");
        return;
    }

    setIsSubmitting(true);
    try {
      const selectedDoctor = allDoctors.find(d => d.id === data.doctorId);
      const doctorName = selectedDoctor ? selectedDoctor.name : "Any Available Doctor";
      const service = "General Inquiry"; // Assuming this is the service for this form

      await addDoc(collection(db, "appointments"), {
        patientId: user.uid,
        patientName: data.name,
        patientEmail: data.email,
        patientPhone: data.phone,
        dateTime: `${data.date} ${data.time}`,
        service: service,
        doctorName: doctorName,
        doctorId: data.doctorId || null,
        status: "Upcoming",
        createdAt: serverTimestamp()
      });

      // await addDoc(collection(db, "notifications"), {
      //   recipientId: "admin",
      //   title: "New Appointment",
      //   description: `${data.name} booked a ${service} with ${doctorName}`,
      //   type: "new_appointment",
      //   read: false,
      //   createdAt: serverTimestamp(),
      // });

      toast({
        title: "Appointment Requested!",
        description: "We have received your request and will be in touch shortly.",
      })
      form.reset();
       if (user) {
            form.setValue("name", user.displayName || "");
            form.setValue("email", user.email || "");
        }
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="appointment" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="container mx-auto grid gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 items-start">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Make an appointment now</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline uppercase text-foreground">Delivering The Best For Your Needs</h2>
              
              <div className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} disabled={inputsDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="email" placeholder="Enter Email" {...field} disabled={inputsDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             <SelectItem value="unassigned">Any Available Doctor</SelectItem>
                            {allDoctors.map(doctor => (
                                <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                          <FormItem>
                          <FormControl>
                              <Input placeholder="MM/DD/YY" type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                          <FormItem>
                          <FormControl>
                              <Input placeholder="Time" type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                </div>
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional message"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <Button type="submit" variant="accent" size="lg" disabled={isSubmitting || loading}>
                  {isSubmitting ? 'Submitting...' : 'Submit Now'}
                </Button>
                {!user && !loading && (
                  <p className="text-sm text-muted-foreground">
                      You will be asked to log in or register to confirm your appointment.
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
                <Card className="bg-background/70">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-2xl font-bold font-headline text-foreground">Need help choosing a doctor?</h3>
                        <FormField
                          control={form.control}
                          name="aiNeeds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Describe your symptoms or needs</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., 'I have a persistent cough and fever' or 'I need a routine check-up for my child'"
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" onClick={handleAiSuggestion} disabled={isAiLoading}>
                            {isAiLoading ? "Thinking..." : "Get AI Suggestion"}
                        </Button>
                    </CardContent>
                </Card>
                {(isAiLoading || aiSuggestions.length > 0) && (
                    <Card>
                        <CardContent className="p-6">
                            <h4 className="text-xl font-bold font-headline text-foreground mb-4">Suggested Doctors</h4>
                            <div className="space-y-4">
                                {isAiLoading ? (
                                    [...Array(2)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Skeleton className="h-16 w-16 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    aiSuggestions.map((doctor) => (
                                        <div key={doctor.name} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={doctor.photoUrl} alt={doctor.name} />
                                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-foreground">{doctor.name}</p>
                                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}
