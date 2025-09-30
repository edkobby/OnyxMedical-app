
"use client"
import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import {
  Bell,
  CircleUser,
  Menu,
  Search,
  UserPlus,
  CalendarPlus,
  MessageSquarePlus,
  Video,
} from "lucide-react"
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where, doc, updateDoc, writeBatch, getDocs, orderBy, limit } from "firebase/firestore";
import { formatDistanceToNow } from 'date-fns';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import AdminSidebar from "./admin-sidebar"
import { Skeleton } from "../ui/skeleton";
import type { NotificationType } from "@/lib/notifications";
import type { AppNotification } from "@/lib/types";


const iconMap: Record<NotificationType, React.ElementType> = {
    new_patient: UserPlus,
    new_appointment: CalendarPlus,
    new_message: MessageSquarePlus,
    new_telemedicine_request: Video,
    appointment_update: CalendarPlus,
    admin_reply: MessageSquarePlus
};


export default function AdminHeader() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchNotifications = React.useCallback(async () => {
    try {
        const q = query(collection(db, "notifications"), where("recipientId", "==", "admin"), orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const notifs = snapshot.docs.map(doc => {
          const data = doc.data();
          return { ...data, id: doc.id, createdAt: data.createdAt?.toDate().toISOString() } as AppNotification
        });
        setNotifications(notifs);
    } catch(error) {
        console.error("Failed to fetch admin notifications:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/auth');
    } catch(error) {
        console.error("Logout failed", error);
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    const notifRef = doc(db, "notifications", notificationId);
    await updateDoc(notifRef, { read: true });
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if(unreadNotifications.length === 0) return;
    
    const batch = writeBatch(db);
    unreadNotifications.forEach(n => {
        const notifRef = doc(db, "notifications", n.id);
        batch.update(notifRef, { read: true });
    });
    
    await batch.commit();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
       <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Image 
                      src="/images/hero/ONYX_logo_cleaned-1 (1)-min.png"
                      alt="Onyx Medical Logo" 
                      width={45} 
                      height={45}
                      className="h-10 w-auto"
                  />
              </Link>
          </SheetHeader>
          <AdminSidebar isMobile={true} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients, doctors..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && <Button variant="link" size="sm" className="h-auto p-0" onClick={handleMarkAllAsRead}>Mark all as read</Button>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           {loading ? (
             <DropdownMenuItem><Skeleton className="h-10 w-full" /></DropdownMenuItem>
           ) : notifications.length === 0 ? (
             <DropdownMenuItem className="justify-center text-sm text-muted-foreground">No new notifications</DropdownMenuItem>
           ) : (
             notifications.map(notification => {
                const Icon = iconMap[notification.type] || Bell;
                const notifContent = (
                     <div className="flex items-start gap-3 whitespace-normal">
                        <div className="flex-shrink-0">
                            <Icon className="h-5 w-5 mt-1 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground/80 mt-1">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                        </div>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-primary absolute right-3 top-1/2 -translate-y-1/2"></div>}
                    </div>
                );
                return (
                    <DropdownMenuItem 
                        key={notification.id} 
                        className="relative"
                        onSelect={(e) => { e.preventDefault(); handleMarkAsRead(notification.id); if (notification.href) router.push(notification.href); }}
                    >
                        {notification.href ? <Link href={notification.href} className="w-full">{notifContent}</Link> : <div className="w-full">{notifContent}</div>}
                    </DropdownMenuItem>
                )
             })
           )}
           <DropdownMenuSeparator />
           <DropdownMenuItem className="text-center justify-center">
              <Link href="/admin/notifications">View all notifications</Link>
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
