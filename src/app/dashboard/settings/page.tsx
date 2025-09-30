
"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardHeader from "@/components/dashboard-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase/client"
import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { updateProfile } from "firebase/auth"

export default function DashboardSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [emergencyName, setEmergencyName] = React.useState("");
  const [emergencyRelationship, setEmergencyRelationship] = React.useState("");
  const [emergencyPhone, setEmergencyPhone] = React.useState("");

  const [loading, setLoading] = React.useState(true);
  const [isProfileSubmitting, setIsProfileSubmitting] = React.useState(false);
  const [isEmergencySubmitting, setIsEmergencySubmitting] = React.useState(false);
  
   React.useEffect(() => {
    if (user) {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(user.displayName || data.name || "");
          setPhone(data.phone || "");
          setDob(data.dob || "");
          setAddress(data.address || "");
          setEmergencyName(data.emergencyContact?.name || "");
          setEmergencyRelationship(data.emergencyContact?.relationship || "");
          setEmergencyPhone(data.emergencyContact?.phone || "");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;
    setIsProfileSubmitting(true);
    
    try {
      // Update Firebase Auth profile first
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Then, update the Firestore document with other details
      const userDocRef = doc(db, "users", user.uid);
      // Use setDoc with merge to create the document if it doesn't exist
      await setDoc(userDocRef, {
        name: name, // Keep name in sync
        phone: phone,
        dob: dob,
        address: address
      }, { merge: true });

      toast({ title: "Profile Updated", description: "Your personal information has been saved." });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({ title: "Error", description: "Could not update your profile.", variant: "destructive" });
    } finally {
      setIsProfileSubmitting(false);
    }
  };
  
  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsEmergencySubmitting(true);

    const userDocRef = doc(db, "users", user.uid);
    try {
      // Use setDoc with merge to be safe
      await setDoc(userDocRef, {
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRelationship,
          phone: emergencyPhone
        }
      }, { merge: true });
       toast({ title: "Emergency Contact Updated", description: "Your emergency contact has been saved." });
    } catch (error) {
       toast({ title: "Error", description: "Could not update emergency contact.", variant: "destructive" });
    } finally {
        setIsEmergencySubmitting(false);
    }
  };

  if (loading) {
      return (
          <>
            <DashboardHeader title="Profile & Settings" description="Update your personal details and manage your account." />
            <div className="grid gap-6">
                <Card>
                    <CardHeader><CardTitle><Skeleton className="h-6 w-48" /></CardTitle><CardDescription><Skeleton className="h-4 w-80" /></CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle><Skeleton className="h-6 w-56" /></CardTitle><CardDescription><Skeleton className="h-4 w-96" /></CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
          </>
      )
  }

  return (
    <>
      <DashboardHeader title="Profile & Settings" description="Update your personal details and manage your account." />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name, contact details, and other personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
               <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL ?? `https://placehold.co/80x80.png`} data-ai-hint="person avatar" />
                    <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button" disabled>Change Photo (Soon)</Button>
               </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email ?? ""} disabled />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
              </div>
               <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Health St, Wellness City" />
                </div>
                <div className="text-right">
                    <Button type="submit" disabled={isProfileSubmitting}>{isProfileSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>Information for who to contact in case of an emergency.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleEmergencySubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input id="emergencyName" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" value={emergencyRelationship} onChange={(e) => setEmergencyRelationship(e.target.value)} />
                </div>
              </div>
               <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input id="emergencyPhone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
                </div>
                <div className="text-right">
                    <Button type="submit" disabled={isEmergencySubmitting}>{isEmergencySubmitting ? 'Saving...' : 'Save Emergency Contact'}</Button>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
