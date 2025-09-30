
"use client"
import * as React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/context/auth-context';
import { createNotification } from "@/lib/notifications";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Conversation, Message } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ContactCareTeamFormProps {
    onMessageSent?: (newConversationId: string) => void;
    isPublicForm?: boolean;
}

const formSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    subject: z.string().min(5, { message: 'Subject must be at least 5 characters long' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
});

export default function ContactCareTeamForm({ onMessageSent, isPublicForm = false }: ContactCareTeamFormProps) {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm({
        validate: zodResolver(formSchema),
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });
    
    React.useEffect(() => {
        if(user && !isPublicForm) {
            form.setValues({
                name: user.displayName || '',
                email: user.email || '',
            })
        }
    }, [user, isPublicForm])

    const handleSubmit = async (values: typeof form.values) => {
        if (!user && !isPublicForm) {
            toast({ title: "Not Authenticated", description: "You must be logged in to send a message.", variant: "destructive" });
            router.push('/auth');
            return;
        }
        setIsSubmitting(true);
        
        const senderName = isPublicForm ? values.name : user?.displayName;
        const senderEmail = isPublicForm ? values.email : user?.email;
        const senderId = isPublicForm ? 'public_contact_form' : user?.uid;

        const initialMessage: Message = {
            senderId: senderId!,
            senderName: senderName || 'Guest',
            content: values.message,
            timestamp: Timestamp.now()
        };

        try {
            const docRef = await addDoc(collection(db, "conversations"), {
                patientId: senderId,
                patientName: senderName,
                patientEmail: senderEmail,
                subject: values.subject,
                lastMessageSnippet: values.message,
                lastUpdatedAt: serverTimestamp(),
                read: false, // Unread for admin
                thread: [initialMessage]
            });
            
            const notifTitle = isPublicForm ? "New Public Inquiry" : "New Patient Message";
            const notifDesc = `${senderName} has sent a new message with the subject: "${values.subject}"`;

            await createNotification({
                recipientId: 'admin',
                title: notifTitle,
                description: notifDesc,
                type: 'new_message',
                href: '/admin/messages'
            });
            
            toast({
                title: "Message Sent!",
                description: isPublicForm ? "Thank you for your inquiry. We will get back to you shortly." : "Your message has been sent to the care team.",
            });
            
            if(onMessageSent) onMessageSent(docRef.id);
            form.reset();

        } catch (error) {
            console.error("Error creating conversation:", error);
            toast({ title: "Submission Failed", description: "Could not send your message. Please try again.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Card className="h-full">
             {isPublicForm ? null : (
                 <CardHeader>
                    <CardTitle>New Message</CardTitle>
                    <CardDescription>Send a secure message to the Onyx Medical care team.</CardDescription>
                </CardHeader>
             )}
            <CardContent className={isPublicForm ? 'p-0' : ''}>
                <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
                    {isPublicForm && (
                         <div className="grid sm:grid-cols-2 gap-6">
                            <Input placeholder="Your Name *" required {...form.getInputProps('name')} />
                            <Input type="email" placeholder="Your Email *" required {...form.getInputProps('email')} />
                        </div>
                    )}
                    <div className={isPublicForm ? '' : 'space-y-2'}>
                        {isPublicForm ? null : <Label htmlFor="subject">Subject</Label>}
                        <Input 
                            id="subject" 
                            placeholder="Subject *"
                            {...form.getInputProps('subject')}
                        />
                        {form.errors.subject && <p className="text-sm text-destructive">{form.errors.subject}</p>}
                    </div>
                    <div className={isPublicForm ? '' : 'space-y-2'}>
                        {isPublicForm ? null : <Label htmlFor="message">Message</Label>}
                        <Textarea 
                            id="message" 
                            rows={isPublicForm ? 6 : 8}
                            placeholder="Message *"
                            {...form.getInputProps('message')}
                        />
                        {form.errors.message && <p className="text-sm text-destructive">{form.errors.message}</p>}
                    </div>
                    <Button type="submit" variant="accent" size={isPublicForm ? 'lg' : 'default'} disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : (isPublicForm ? 'Send Us' : 'Send Message')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
