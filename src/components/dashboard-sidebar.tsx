
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Calendar,
  Video,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  UserPlus,
  CalendarPlus,
  MessageSquarePlus,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { useAuth } from "@/context/auth-context"
import { auth, db } from "@/lib/firebase/client";
import { signOut } from "firebase/auth"
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import type { AppNotification } from "@/lib/types"
import type { NotificationType } from "@/lib/notifications"
import { formatDistanceToNow } from "date-fns"

const sidebarNavLinks = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/telemedicine", label: "Telemedicine", icon: Video },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: ClipboardCheck },
  { href: "/dashboard/billing", label: "Billing & Payments", icon: CreditCard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
];

const sidebarBottomLinks = [
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

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      }
  };

  const NotificationBell = () => (
     <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="ghost"
                className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary justify-start relative",
                    isCollapsed && "justify-center"
                )}
            >
                <Bell className="h-4 w-4" />
                <span className={cn("truncate", isCollapsed && "hidden")}>Notifications</span>
                 {unreadNotifications > 0 && (
                    <Badge className={cn("absolute h-5 w-5 p-0 flex items-center justify-center text-xs", isCollapsed ? 'top-1 right-1' : 'right-2')}>
                        {unreadNotifications}
                    </Badge>
                )}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 ml-4">
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
  )

  return (
    <aside className={cn(
        "hidden sm:flex flex-col fixed inset-y-0 left-0 z-10 bg-background border-r transition-all duration-300",
        isCollapsed ? "w-14" : "w-64"
    )}>
      <TooltipProvider>
        <div className="flex flex-col h-full">
            <div className={cn(
                "flex items-center border-b px-4 transition-all duration-300", 
                isCollapsed ? "justify-center h-16" : "justify-between h-16"
            )}>
                <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "hidden")}>
                  <Image 
                    src="/images/hero/ONYX_logo_cleaned-1 (1)-min.png" 
                    alt="Onyx Medical Logo" 
                    width={50} 
                    height={50}
                    className="h-11 w-auto"
                  />
                  {/* <span className="">Onyx Medical</span> */}
                </Link>
                 <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
            <nav className="flex-1 grid gap-1 p-2 text-sm font-medium">
            {sidebarNavLinks.map(({ href, label, icon: Icon }) => (
                <Tooltip key={href} delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link
                    href={href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === href && "bg-muted text-primary",
                        isCollapsed && "justify-center"
                    )}
                    >
                    <Icon className="h-4 w-4" />
                    <span className={cn("truncate", isCollapsed && "hidden")}>{label}</span>
                    </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
                </Tooltip>
            ))}
            </nav>
            <div className="mt-auto p-2 border-t">
                 {sidebarBottomLinks.map(({ href, label, icon: Icon }) => (
                    <Tooltip key={href} delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Link
                        href={href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === href && "bg-muted text-primary",
                            isCollapsed && "justify-center"
                        )}
                        >
                        <Icon className="h-4 w-4" />
                        <span className={cn("truncate", isCollapsed && "hidden")}>{label}</span>
                        </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
                    </Tooltip>
                 ))}
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className="w-full">
                           <NotificationBell />
                        </div>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">Notifications</TooltipContent>}
                </Tooltip>
                 <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className={cn(
                                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary justify-start",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className={cn("truncate", isCollapsed && "hidden")}>Logout</span>
                        </Button>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
                </Tooltip>
            </div>
            <div className="border-t p-2">
                <div className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground",
                    isCollapsed && "justify-center"
                )}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL ?? `https://placehold.co/80x80.png`} alt={user?.displayName ?? "User"} />
                      <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className={cn("truncate", isCollapsed && "hidden")}>
                        <p className="font-semibold text-foreground text-sm">{user?.displayName}</p>
                        <p className="text-xs">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
      </TooltipProvider>
    </aside>
  );
}
