
"use client"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Calendar,
  Video,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  Menu,
  Bell,
  Settings,
  LogOut,
  UserPlus,
  CalendarPlus,
  MessageSquarePlus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { signOut } from "firebase/auth"
import { auth, db } from "@/lib/firebase/client"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns"
import type { AppNotification } from "@/lib/types"
import type { NotificationType } from "@/lib/notifications"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

const navLinks = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/telemedicine", label: "Telemedicine", icon: Video },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: ClipboardCheck },
  { href: "/dashboard/billing", label: "Billing & Payments", icon: CreditCard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
];

const bottomLinks = [
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const iconMap: Record<NotificationType, React.ElementType> = {
    new_patient: UserPlus,
    new_appointment: CalendarPlus,
    new_message: MessageSquarePlus,
    new_telemedicine_request: Video,
    appointment_update: CalendarPlus,
    admin_reply: MessageSquarePlus,
};

export default function MobileDashboardHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = React.useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;
    const q = query(
        collection(db, "notifications"),
        where("recipientId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
             id: doc.id,
             ...data,
             createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          } as AppNotification;
        })
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/auth');
    } catch(error) {
        console.error("Logout failed", error);
    }
  }

  const handleNotificationClick = async (notification: AppNotification) => {
      if (!notification.read) {
          await updateDoc(doc(db, "notifications", notification.id), { read: true });
      }
      if (notification.href) {
          router.push(notification.href);
          setOpen(false); // Close sheet on navigation
      }
  };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs flex flex-col">
          <SheetHeader>
            <SheetTitle>
                 <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="group flex h-10 shrink-0 items-center gap-2 text-lg font-semibold text-primary-foreground md:text-base"
                >
                <Image 
                    src="/images/hero/ONYX_logo_cleaned-1 (1)-min.png"
                    alt="Onyx Medical Logo" 
                    width={32} 
                    height={32}
                    className="h-8 w-auto"
                />
                <span className="text-foreground font-bold">Onyx Medical</span>
                </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="grid gap-4 text-lg font-medium flex-1 overflow-y-auto pt-4">
            {navLinks.map(link => (
                <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                <link.icon className="h-5 w-5" />
                {link.label}
                </Link>
            ))}
          </nav>
          <div className="mt-auto border-t pt-4">
            {bottomLinks.map(link => (
                 <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                </Link>
            ))}
             <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="w-full flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground mt-4"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
          </div>
        </SheetContent>
      </Sheet>
       <div className="relative ml-auto flex-1 md:grow-0">
        </div>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">
                            {unreadNotifications}
                        </Badge>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                 <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            You have {unreadNotifications} unread messages.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {notifications.slice(0, 5).map(notification => {
                            const Icon = iconMap[notification.type] || Bell;
                            return (
                                <button key={notification.id} onClick={() => handleNotificationClick(notification)} className="w-full text-left grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0 last:border-b-0 border-b hover:bg-muted -m-2 p-2 rounded-md">
                                    <span className={cn("flex h-2 w-2 translate-y-1 rounded-full", !notification.read && "bg-primary")} />
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium">{notification.title}</p>
                                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    </header>
  )
}
