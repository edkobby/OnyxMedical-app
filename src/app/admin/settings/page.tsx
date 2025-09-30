
"use client"
import * as React from "react"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSettings {
    name: string;
    contact: string;
}

interface NoticeSettings {
    enabled: boolean;
    text: string;
}

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<ProfileSettings>({ name: 'Onyx Medical & Fertility Center', contact: 'P.O.Box AE 15, Atomic, Accra' });
    const [notice, setNotice] = React.useState<NoticeSettings>({ enabled: false, text: 'Important: Our phone lines are currently down. Please use email for contact.' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    React.useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const docRef = doc(db, "content", "website");
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.profile) setProfile(data.profile);
                    if (data.emergencyNotice) setNotice(data.emergencyNotice);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast({ title: "Error", description: "Could not load settings from database.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleSave = async (section: string, data: any) => {
        setIsSubmitting(true);
        try {
            await setDoc(doc(db, "content", "website"), { [section]: data }, { merge: true });
            toast({
                title: "Settings Saved",
                description: `The ${section.replace(/([A-Z])/g, ' $1').trim()} settings have been updated.`,
            });
        } catch (error) {
            console.error(`Error saving ${section}:`, error);
            toast({ title: "Save Failed", description: "There was an error saving the settings.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return (
             <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-7 w-64" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-80" /></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                         <Skeleton className="h-10 w-24" />
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Hospital Profile Settings</CardTitle>
                <CardDescription>Update your center's main information. This can be used across the website.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('profile', profile); }} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="hospital-name">Hospital Name</Label>
                        <Input 
                            id="hospital-name" 
                            name="name" 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})} 
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contact-info">Contact Information / Address</Label>
                        <Textarea 
                            id="contact-info" 
                            name="contact" 
                            value={profile.contact} 
                            onChange={(e) => setProfile({...profile, contact: e.target.value})}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                </form>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Emergency Notice Bar</CardTitle>
                <CardDescription>Display a prominent notice bar on the public website.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('emergencyNotice', notice); }} className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <Switch 
                            id="notice-enabled" 
                            name="enabled"
                            checked={notice.enabled}
                            onCheckedChange={(checked) => setNotice({...notice, enabled: checked})}
                        />
                        <Label htmlFor="notice-enabled">Enable Notice Bar</Label>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notice-text">Notice Text</Label>
                        <Input 
                            id="notice-text" 
                            name="text" 
                            value={notice.text} 
                            onChange={(e) => setNotice({...notice, text: e.target.value})}
                            disabled={!notice.enabled}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Notice'}</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  )
}
