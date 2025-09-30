
"use client"
import * as React from "react"
import { MoreHorizontal, ShieldCheck } from "lucide-react"
import { doc, updateDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Patient' | 'Admin' | 'Doctor' | 'Staff' | 'Accountant';
    status: 'Active' | 'Inactive';
    createdAt?: any; // Can be Timestamp or string
    lastLogin?: any; // This is likely not tracked, keeping as is
}


export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                role: data.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1)) : 'Patient',
                createdAt: data.createdAt?.toDate()?.toISOString(),
            } as User
        });
        setUsers(usersData);
    } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
            title: "Error fetching data",
            description: error.message || "Could not retrieve user list.",
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };
  
  const handleMakeAdmin = async (user: User) => {
      if(window.confirm(`Are you sure you want to make ${user.name} an admin? This must be done carefully.`)) {
          const userRef = doc(db, "users", user.id);
          try {
            await updateDoc(userRef, { role: 'admin' });
            toast({ title: "Success", description: `${user.name} is now an admin.` });
            fetchUsers();
          } catch(error) {
              toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
          }
      }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser) return;
    
    const formData = new FormData(event.currentTarget);
    const newRole = formData.get('role') as string;
    const newName = formData.get('name') as string;

    const userRef = doc(db, "users", selectedUser.id);
    try {
        await updateDoc(userRef, {
            name: newName,
            role: newRole.toLowerCase(),
        });
        setUsers(users.map(u => u.id === selectedUser.id ? {...u, name: newName, role: newRole as User['role']} : u));
        toast({ title: "User Updated", description: `Details for ${newName} have been updated.` });
        setIsDialogOpen(false);
        setSelectedUser(null);
    } catch(error) {
        toast({ title: "Update Failed", description: "Could not update user details.", variant: "destructive" });
    }
  };

  const formatDateSafe = (date?: string) => {
    if (!date) return 'N/A';
    try {
        return format(new Date(date), 'PPP');
    } catch (e) {
        return 'N/A';
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage roles and permissions for all users in the system.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              )) : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Patient' ? 'outline' : 'secondary'}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDateSafe(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>Edit Role</DropdownMenuItem>
                        {user.role !== 'Admin' && (
                            <DropdownMenuItem onClick={() => handleMakeAdmin(user)}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Make Admin
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if(!isOpen) setSelectedUser(null)}}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Edit User Role</DialogTitle>
                  <DialogDescription>
                      Update the role and details for {selectedUser?.name}.
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" defaultValue={selectedUser?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={selectedUser?.email} disabled />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select name="role" defaultValue={selectedUser?.role || 'Patient'}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Patient">Patient</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Accountant">Accountant</SelectItem>
                           <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}
