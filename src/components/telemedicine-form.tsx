
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Clock, User, Video } from "lucide-react"
import { format } from "date-fns"
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/context/auth-context";
import type { Doctor } from "@/lib/types";
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const telemedicineFormSchema = z.object({
  doctorName: z.string({
    required_error: "Please select a doctor.",
  }),
  consultationDate: z.date({
    required_error: "A date for consultation is required.",
  }),
  consultationTime: z.string().min(1, "Please select a time."),
  consultationReason: z.string().max(500, "Reason must not exceed 500 characters.").min(10, "Please provide a brief reason for your consultation."),
  platform: z.enum(["whatsapp", "google_meet"], {
    required_error: "You need to select a consultation platform.",
  }),
})

type TelemedicineFormValues = z.infer<typeof telemedicineFormSchema>

export default function TelemedicineForm() {
  const { toast } = useToast()
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);

  React.useEffect(() => {
    const fetchDoctors = async () => {
        const q = query(collection(db, "doctors"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(doctorsData);
    };
    fetchDoctors();
  }, []);

  const form = useForm<TelemedicineFormValues>({
    resolver: zodResolver(telemedicineFormSchema),
  })

  async function onSubmit(data: TelemedicineFormValues) {
    if (!user) {
        toast({
            title: "Please Log In",
            description: "You must be logged in to request a consultation.",
            variant: "destructive"
        });
        router.push('/auth');
        return;
    }
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, "telemedicine"), {
            patientId: user.uid,
            patientName: user.displayName,
            patientEmail: user.email,
            doctorName: data.doctorName,
            dateTime: `${format(data.consultationDate, 'yyyy-MM-dd')} ${data.consultationTime}`,
            reason: data.consultationReason,
            platform: data.platform,
            status: "Requested",
            createdAt: serverTimestamp(),
            sessionLink: null,
        });

        // await addDoc(collection(db, "notifications"), {
        //   recipientId: "admin",
        //   title: "New Telemedicine Request",
        //   description: `${user.displayName} requested a virtual consultation with ${data.doctorName}.`,
        //   type: "new_telemedicine_request",
        //   read: false,
        //   createdAt: serverTimestamp(),
        // });

        toast({
            title: "Virtual Consultation Booked!",
            description: "Our team will contact you shortly to confirm your appointment details and payment.",
        })
        form.reset();
    } catch(error) {
        console.error("Error booking telemedicine session: ", error);
        toast({
            title: "Booking Failed",
            description: "An error occurred. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline uppercase text-foreground">Book a Virtual Consultation</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Please fill out the form below. This service is for registered patients only.
            </p>
        </div>
        <div className="mx-auto max-w-2xl mt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <User className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Choose a specialist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor, index) => (
                           <SelectItem key={doctor.id} value={doctor.name}>{doctor.name} - {doctor.specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="consultationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Consultation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0,0,0,0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="consultationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                           <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="09:00 AM">Morning (9am - 12pm)</SelectItem>
                        <SelectItem value="02:00 PM">Afternoon (1pm - 4pm)</SelectItem>
                      </SelectContent>
                    </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="consultationReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Consultation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your symptoms or reason for the virtual visit."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Preferred Platform</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="whatsapp" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            WhatsApp Video Call
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="google_meet" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Google Meet
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                <Video className="mr-2 h-5 w-5" />
                {isSubmitting ? "Requesting..." : "Request Virtual Consultation"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
