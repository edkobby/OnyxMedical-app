
"use client"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { collection, addDoc, doc, updateDoc, onSnapshot, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { Doctor } from "@/lib/types";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "doctors"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const doctorsData: Doctor[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(doctorsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching doctors:", error);
        toast({
            title: "Error fetching data",
            description: "Could not retrieve doctor list. Check console and Firebase security rules.",
            variant: "destructive"
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAddNew = () => {
    setSelectedDoctor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };
  
  const confirmDelete = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!doctorToDelete) return;

    const doctorRef = doc(db, "doctors", doctorToDelete.id);
    try {
        await deleteDoc(doctorRef);
        toast({
          title: "Doctor Removed",
          description: `Dr. ${doctorToDelete.name}'s profile has been successfully removed.`,
        });
        setDoctorToDelete(null);
        setIsDeleteDialogOpen(false);
        // If the deleted doctor was being edited, close that dialog too
        if (selectedDoctor && selectedDoctor.id === doctorToDelete.id) {
            setIsDialogOpen(false);
            setSelectedDoctor(null);
        }
    } catch (error) {
        toast({
          title: "Error",
          description: "Could not remove the doctor. Please try again.",
          variant: "destructive"
        });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get('avatar') as File;
    let avatarUrl = selectedDoctor?.avatar || '';

    const doctorData = {
        name: formData.get('name') as string,
        specialty: formData.get('specialty') as string,
        patients: Number(formData.get('patients') as string),
        status: formData.get('status') as Doctor['status'],
        avatar: avatarUrl, // temporary value
    };
    
    try {
        if (imageFile && imageFile.size > 0) {
          const storageRef = ref(storage, `doctors/${Date.now()}_${imageFile.name}`);
          const uploadResult = await uploadBytes(storageRef, imageFile);
          avatarUrl = await getDownloadURL(uploadResult.ref);
          doctorData.avatar = avatarUrl;
        }

        if (selectedDoctor) {
          // Edit existing doctor
          const doctorRef = doc(db, "doctors", selectedDoctor.id);
          await updateDoc(doctorRef, doctorData);
          toast({
            title: "Doctor Profile Updated",
            description: `${doctorData.name}'s profile has been successfully updated.`,
          });
        } else {
          // Add new doctor
          if (!doctorData.avatar) {
              doctorData.avatar = `https://placehold.co/80x80.png`
          }
          await addDoc(collection(db, "doctors"), {
              ...doctorData,
              createdAt: serverTimestamp(),
          });
          toast({
            title: "Doctor Added",
            description: `${doctorData.name} has been added to the system.`,
          });
        }
        setIsDialogOpen(false);
        setSelectedDoctor(null);
    } catch (error) {
        console.error("Error submitting doctor form:", error);
        toast({
            title: "Submission Error",
            description: "An error occurred while saving the doctor's profile.",
            variant: "destructive"
        })
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex-row gap-4 items-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardHeader>
                        <CardContent><Skeleton className="h-6 w-1/2" /></CardContent>
                        <CardFooter className="flex justify-between">
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doctors</h2>
          <p className="text-muted-foreground">
            Manage your center's doctors and their profiles.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Doctor
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader className="flex-row gap-4 items-center">
               <Image
                  alt="Doctor avatar"
                  className="rounded-full object-cover"
                  height={80}
                  src={doctor.avatar}
                  data-ai-hint="doctor portrait"
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                  width={80}
                />
              <div>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>{doctor.specialty}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Badge variant={doctor.status === 'Online' ? 'default' : 'secondary'}>{doctor.status}</Badge>
                <Badge variant="outline">{doctor.patients} patients</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
              <Button className="w-full" onClick={() => handleEdit(doctor)}>Edit</Button>
              <Button variant="destructive" className="w-full" onClick={() => confirmDelete(doctor)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedDoctor(null); }}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>{selectedDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}</DialogTitle>
                  <DialogDescription>
                    {selectedDoctor ? `Update the profile for ${selectedDoctor.name}.` : 'Fill in the details for the new doctor.'}
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="max-h-[75vh] overflow-y-auto pr-6 grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" defaultValue={selectedDoctor?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input id="specialty" name="specialty" defaultValue={selectedDoctor?.specialty} required />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="patients">Patients</Label>
                      <Input id="patients" name="patients" type="number" defaultValue={selectedDoctor?.patients} required />
                  </div>
                   <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" name="status" defaultValue={selectedDoctor?.status || 'Offline'} className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option>Online</option>
                            <option>Offline</option>
                            <option>On Break</option>
                        </select>
                    </div>
                   <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar</Label>
                      {selectedDoctor?.avatar && <img src={selectedDoctor.avatar} alt="Current avatar" className="w-20 h-20 rounded-full object-cover border" />}
                      <Input id="avatar" name="avatar" type="file" accept="image/*" />
                      <p className="text-xs text-muted-foreground">Upload a new image to replace the current one.</p>
                  </div>
                   <DialogFooter className="pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm -mx-6 px-6 -mb-4 pb-4 sm:justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete Dr. {doctorToDelete?.name}'s profile from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDoctorToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}
