
"use client"
import * as React from "react"
import { useRouter } from "next/navigation";
import { doc, updateDoc, writeBatch, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { formatDistanceToNow } from "date-fns";
import { Bell, CalendarPlus, CheckCheck, MessageSquarePlus, UserPlus, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationType } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const iconMap: Record<NotificationType, React.ElementType> = {
    new_patient: UserPlus,
    new_appointment: CalendarPlus,
    new_message: MessageSquarePlus,
    new_telemedicine_request: Video,
    appointment_update: CalendarPlus,
    admin_reply: MessageSquarePlus,
};

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "notifications"), where("recipientId", "==", "admin"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const notifs = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
                    } as AppNotification
                })
                setNotifications(notifs);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllAsRead = async () => {
        const batch = writeBatch(db);
        const unreadNotifications = notifications.filter(n => !n.read);
        unreadNotifications.forEach(n => {
            const notifRef = doc(db, "notifications", n.id);
            batch.update(notifRef, { read: true });
        });
        await batch.commit();
        setNotifications(notifications.map(n => ({...n, read: true})));
    };

    const handleNotificationClick = async (notification: AppNotification) => {
        if (!notification.read) {
            await updateDoc(doc(db, "notifications", notification.id), { read: true });
            setNotifications(notifications.map(n => n.id === notification.id ? {...n, read: true} : n));
        }
        if (notification.href) {
            router.push(notification.href);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground">
                        All system alerts and notifications.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={handleMarkAllAsRead}>
                        <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                         <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center p-12 text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-medium">No notifications yet</h3>
                            <p className="mt-1 text-sm">New alerts will appear here as they come in.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {notifications.map(notification => {
                                const Icon = iconMap[notification.type] || Bell;
                                return (
                                    <li key={notification.id}>
                                        <button 
                                            onClick={() => handleNotificationClick(notification)}
                                            className={cn(
                                                "w-full text-left flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                                                !notification.read && "bg-secondary"
                                            )}
                                        >
                                            <div className="p-2 bg-background rounded-full border">
                                                <Icon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{notification.title}</p>
                                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                            </div>
                                            <div className="text-right space-y-2">
                                                 <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                                {!notification.read && <Badge variant="default" className="ml-auto">New</Badge>}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
