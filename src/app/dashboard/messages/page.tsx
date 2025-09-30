
"use client"
import * as React from "react"
import { Archive, Search, Send, Trash2, Edit } from "lucide-react"
import { collection, onSnapshot, query, where, doc, updateDoc, arrayUnion, serverTimestamp, orderBy, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { formatDistanceToNow, format } from "date-fns";
import { useAuth } from "@/context/auth-context";

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard-header";
import type { Conversation, Message } from "@/lib/types";
import ContactCareTeamForm from "@/components/contact-care-team-form";
import { createNotification } from "@/lib/notifications";

export default function DashboardMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [replyContent, setReplyContent] = React.useState("");
  const [isComposing, setIsComposing] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    const q = query(
        collection(db, "conversations"), 
        where("patientId", "==", user.uid),
        orderBy("lastUpdatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const convosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation))
        setConversations(convosData);

        if (isComposing) {
          // Do nothing, user is writing a new message
        } else if (!selectedConversation && convosData.length > 0) {
            // Auto-select the first conversation if none is selected
            setSelectedConversation(convosData[0]);
        } else if (selectedConversation) {
            // Refresh selected conversation data if it exists
            const updatedSelected = convosData.find(c => c.id === selectedConversation.id);
            setSelectedConversation(updatedSelected || (convosData.length > 0 ? convosData[0] : null));
        }

        setLoading(false);
    }, (error) => {
        console.error("Error fetching conversations:", error);
        toast({ title: "Error", description: "Could not fetch messages.", variant: "destructive" });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast, isComposing, selectedConversation]);

  const handleSelectConversation = (convo: Conversation) => {
    setSelectedConversation(convo);
    setIsComposing(false);
  }

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedConversation || !user) return;

    const newMessage: Message = {
        senderId: user.uid,
        senderName: user.displayName || 'Patient',
        content: replyContent,
        timestamp: Timestamp.now(),
    };

    const convoRef = doc(db, "conversations", selectedConversation.id);
    try {
        await updateDoc(convoRef, {
            thread: arrayUnion(newMessage),
            lastMessageSnippet: replyContent,
            lastUpdatedAt: serverTimestamp(),
            read: false, // Mark as unread for the admin
        });
        
        await createNotification({
          recipientId: "admin",
          title: "New Patient Message",
          description: `You have a new message from ${user.displayName || 'a patient'}.`,
          type: 'new_message',
          href: '/admin/messages'
        });

        setReplyContent("");
        toast({ title: "Message Sent", description: "Your message has been sent successfully." });
    } catch (error) {
        console.error("Error sending reply:", error);
        toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    }
  }

  const handleNewMessageSuccess = (newConvoId: string) => {
    setIsComposing(false);
    // Firestore listener will automatically add the new conversation to the list.
    // We can try to select it once it appears.
    const interval = setInterval(() => {
      const newConvo = conversations.find(c => c.id === newConvoId);
      if (newConvo) {
        setSelectedConversation(newConvo);
        clearInterval(interval);
      }
    }, 100);
  }

  return (
    <>
      <DashboardHeader title="Messages" description="Communicate securely with your care team." />

       <div className="grid md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-180px)]">
        <Card className="flex flex-col">
            <CardHeader className="p-4 border-b flex-row justify-between items-center">
                <CardTitle className="text-lg">Inbox</CardTitle>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => { setIsComposing(true); setSelectedConversation(null); }}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">New Message</span>
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
                 <div className="flex flex-col">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                           <div key={i} className="flex items-start gap-3 p-3 border-b">
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                           </div>
                        ))
                    ) : conversations.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No conversations yet. Start one by clicking the edit icon.
                        </div>
                    ) : (
                        conversations.map((convo) => (
                            <button 
                                key={convo.id} 
                                onClick={() => handleSelectConversation(convo)}
                                className={cn(
                                    "flex flex-col items-start gap-2 border-b p-3 text-left text-sm transition-all hover:bg-muted",
                                    selectedConversation?.id === convo.id && "bg-muted"
                                )}
                            >
                                <div className="flex w-full items-start gap-3">
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex w-full items-center">
                                            <div className="font-semibold truncate">{convo.subject}</div>
                                            <div className="ml-auto text-xs text-muted-foreground">
                                                {convo.lastUpdatedAt?.toDate ? formatDistanceToNow(convo.lastUpdatedAt.toDate(), { addSuffix: true }) : '...'}
                                            </div>
                                        </div>
                                        <p className="line-clamp-2 text-xs text-muted-foreground">
                                            {convo.lastMessageSnippet}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
        
        {isComposing ? (
            <ContactCareTeamForm onMessageSent={handleNewMessageSuccess} />
        ) : selectedConversation ? (
            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center border-b p-4">
                    <div className="grid gap-0.5">
                        <p className="font-semibold">{selectedConversation.subject}</p>
                        <p className="text-xs text-muted-foreground">with Onyx Medical Admin</p>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm flex-1 overflow-y-auto">
                    <div className="space-y-4">
                        {selectedConversation.thread.map((message, index) => (
                            <div key={index} className={cn(
                                "flex items-end gap-3",
                                message.senderId === user?.uid ? "justify-end" : "justify-start"
                            )}>
                                {message.senderId !== user?.uid && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>O</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                    message.senderId === user?.uid ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                   <p className="font-semibold mb-1 text-xs">{message.senderName}</p>
                                   <p>{message.content}</p>
                                   <p className="text-xs opacity-70 mt-2 text-right">
                                       {message.timestamp?.toDate ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                   </p>
                                </div>
                             </div>
                        ))}
                    </div>
                </CardContent>
                <div className="p-4 border-t bg-background">
                    <form onSubmit={handleReplySubmit}>
                        <div className="relative">
                            <Textarea
                                placeholder="Write your message..."
                                className="pr-16"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        ) : (
            <Card className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    {loading ? <p>Loading conversations...</p> : <p>Select a conversation to view or start a new one.</p>}
                </div>
            </Card>
        )}
    </div>
    </>
  )
}
