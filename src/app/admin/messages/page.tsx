
"use client"
import * as React from "react"
import { Archive, Search, Send, Trash2 } from "lucide-react"
import { doc, updateDoc, arrayUnion, serverTimestamp, Timestamp, getDocs, collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { formatDistanceToNow, parseISO } from "date-fns";

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation, Message } from "@/lib/types";
import { createNotification } from "@/lib/notifications";


export default function AdminMessagesPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [replyContent, setReplyContent] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "conversations"), orderBy("lastUpdatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const convosData = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id,
                ...data,
                lastUpdatedAt: data.lastUpdatedAt?.toDate ? data.lastUpdatedAt.toDate().toISOString() : new Date().toISOString(),
                thread: data.thread?.map((m: any) => ({...m, timestamp: m.timestamp?.toDate ? m.timestamp.toDate().toISOString() : new Date().toISOString()})) || []
            } as Conversation
        });
        setConversations(convosData);
        
        // If a conversation is selected, update its data
        if (selectedConversation) {
            const updatedSelected = convosData.find(c => c.id === selectedConversation.id);
            setSelectedConversation(updatedSelected || null);
        } else if (convosData.length > 0) {
             // If no conversation is selected, select the first one
            setSelectedConversation(convosData[0]);
        }
        setLoading(false);
    }, (error) => {
      console.error("Error fetching conversations:", error);
      toast({ title: "Error", description: "Could not fetch messages.", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectConversation = (convo: Conversation) => {
    setSelectedConversation(convo);
    if (!convo.read) {
        const convoRef = doc(db, "conversations", convo.id);
        updateDoc(convoRef, { read: true });
    }
  }

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedConversation) return;

    const newMessage: Message = {
        senderId: 'admin',
        senderName: 'Onyx Medical Admin',
        content: replyContent,
        timestamp: Timestamp.now(),
    };

    const convoRef = doc(db, "conversations", selectedConversation.id);
    try {
        await updateDoc(convoRef, {
            thread: arrayUnion(newMessage),
            lastMessageSnippet: replyContent,
            lastUpdatedAt: serverTimestamp(),
            read: true, // Should be read by admin, but unread for patient
        });
        
        await createNotification({
            recipientId: selectedConversation.patientId,
            title: "New message from your Care Team",
            description: `You have a new reply regarding: "${selectedConversation.subject}"`,
            type: 'admin_reply',
            href: '/dashboard/messages'
        });
        
        setReplyContent("");
        toast({ title: "Reply Sent", description: "Your message has been sent successfully." });
    } catch (error) {
        console.error("Error sending reply:", error);
        toast({ title: "Error", description: "Could not send reply.", variant: "destructive" });
    }
  }

  const formatDate = (dateString?: string) => {
      if (!dateString) return '...';
      try {
        return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
      } catch (e) {
          return '...';
      }
  }

  return (
    <div className="grid md:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-100px)]">
        <Card className="flex flex-col">
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-xl">Inbox</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-8" />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
                 <div className="flex flex-col">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                           <div key={i} className="flex items-start gap-3 p-3 border-b">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                           </div>
                        ))
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
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{convo.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex w-full items-center">
                                            <div className={cn("font-semibold", !convo.read && "font-bold")}>{convo.patientName}</div>
                                            <div className={cn("ml-auto text-xs", !convo.read ? "text-foreground" : "text-muted-foreground")}>
                                                {formatDate(convo.lastUpdatedAt)}
                                            </div>
                                        </div>
                                        <p className={cn("text-xs font-medium truncate", !convo.read && "font-semibold")}>{convo.subject}</p>
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
        
        {selectedConversation ? (
            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center border-b p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>{selectedConversation.patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="font-semibold">{selectedConversation.patientName}</p>
                            <p className="text-xs text-muted-foreground">{selectedConversation.patientEmail}</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8"><Archive className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm flex-1 overflow-y-auto">
                    <div className="space-y-4">
                        {selectedConversation.thread.map((message, index) => (
                            <div key={index} className={cn(
                                "flex items-end gap-3",
                                message.senderId === 'admin' ? "justify-end" : "justify-start"
                            )}>
                                {message.senderId !== 'admin' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{selectedConversation.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                    message.senderId === 'admin' ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                   <p className="font-semibold mb-1 text-xs">{message.senderName}</p>
                                   <p>{message.content}</p>
                                   <p className="text-xs opacity-70 mt-2 text-right">
                                       {formatDate(message.timestamp)}
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
                                placeholder={`Reply to ${selectedConversation.patientName}...`}
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
                    <p>{loading ? 'Loading conversations...' : 'Select a conversation to view messages.'}</p>
                </div>
            </Card>
        )}
    </div>
  )
}
