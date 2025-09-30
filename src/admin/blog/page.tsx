
"use client"
import * as React from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import type { BlogPost } from "@/lib/types";

// Helper function to create a URL-friendly slug
const createSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};


export default function AdminBlogPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, "blog"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData: BlogPost[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setPosts(postsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching blog posts:", error);
        toast({
            title: "Error fetching data",
            description: "Could not retrieve blog posts. Check Firestore rules.",
            variant: "destructive"
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const postRef = doc(db, "blog", postId);
    try {
        await deleteDoc(postRef);
        toast({
            title: "Post Deleted",
            description: "The blog post has been successfully deleted.",
        });
    } catch(error) {
        toast({
            title: "Deletion Failed",
            description: "Could not delete the post. Please try again.",
            variant: "destructive"
        });
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File;
    let imageUrl = selectedPost?.imageUrl || '';

    const postData: Omit<BlogPost, 'id' | 'createdAt'> = {
        title: title,
        slug: createSlug(title),
        author: formData.get('author') as string,
        date: formData.get('date') as string,
        content: formData.get('content') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
        status: formData.get('status') as 'Published' | 'Draft',
        imageUrl: imageUrl, // Temporary value
    };

    try {
        // Handle file upload if a new image is provided
        if (imageFile && imageFile.size > 0) {
            const storageRef = ref(storage, `blog/${Date.now()}_${imageFile.name}`);
            const uploadResult = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(uploadResult.ref);
            postData.imageUrl = imageUrl;
        }

        if (selectedPost) {
            // Edit existing post
            const postRef = doc(db, "blog", selectedPost.id);
            await updateDoc(postRef, postData);
            toast({
                title: "Post Updated",
                description: "The blog post has been successfully updated.",
            });
        } else {
            // Add new post
             if (!postData.imageUrl) {
                postData.imageUrl = "https://placehold.co/1200x600.png"
            }
            await addDoc(collection(db, "blog"), {
                ...postData,
                createdAt: serverTimestamp(),
            });
            toast({
                title: "Post Created",
                description: "The new blog post has been created.",
            });
        }
        setIsDialogOpen(false);
        setSelectedPost(null);
    } catch (error) {
         console.error("Error submitting blog post: ", error);
         toast({
            title: "Submission Failed",
            description: "An error occurred while saving the post.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">
            Create and manage blog posts and news articles.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto"/></TableCell>
                  </TableRow>
                ))
              ) : (
                posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {post.date instanceof Timestamp ? format(post.date.toDate(), 'PPP') : post.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.status === "Published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(post)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedPost(null); }}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle>{selectedPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
                  <DialogDescription>
                      Fill in the details for the blog post below. Changes are saved live.
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="max-h-[75vh] overflow-y-auto pr-6 grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={selectedPost?.title} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input id="author" name="author" defaultValue={selectedPost?.author} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        name="date" 
                        type="date" 
                        defaultValue={selectedPost?.date ? (typeof selectedPost.date === 'string' ? selectedPost.date : new Date((selectedPost.date as Timestamp).toDate()).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]}
                        required 
                      />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" name="content" defaultValue={selectedPost?.content} required rows={10} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" name="tags" defaultValue={selectedPost?.tags?.join(', ')} />
                  </div>
                   <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={selectedPost?.status || 'Draft'}
                            className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                  <div className="space-y-2">
                      <Label htmlFor="image">Feature Image</Label>
                      {selectedPost?.imageUrl && <img src={selectedPost.imageUrl} alt="Current feature" className="w-32 h-auto rounded-lg border" />}
                      <Input id="image" name="image" type="file" accept="image/*" />
                       <p className="text-xs text-muted-foreground">Upload a new image to replace the current one.</p>
                  </div>
                   <DialogFooter className="pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm -mx-6 px-6 -mb-4 pb-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Post'}
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}
