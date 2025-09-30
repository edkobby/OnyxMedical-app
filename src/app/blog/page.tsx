

"use client"
import Link from "next/link";
import Image from "next/image";
import * as React from 'react';
import { User, Calendar } from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import PageBanner from "@/components/page-banner";
import type { BlogPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";


const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="bg-background rounded-lg overflow-hidden border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            data-ai-hint="blog post"
          />
        </div>
      </Link>
      <div className="p-6">
        <h3 className="text-xl font-bold font-headline text-foreground hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(post.date as string), 'PPP')}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground">{post.excerpt}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href={`/blog/${post.slug}`}>Read More</Link>
        </Button>
      </div>
    </div>
  );
};

const BlogCardSkeleton = () => {
    return (
        <div className="bg-background rounded-lg overflow-hidden border border-border/50 shadow-sm">
            <Skeleton className="w-full aspect-video" />
            <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}

export default function BlogPage() {
    const [posts, setPosts] = React.useState<BlogPost[]>([]);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        const fetchPosts = async () => {
            const postsCollection = collection(db, "blog");
            const q = query(postsCollection, where("status", "==", "Published"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            const postsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    slug: data.slug || doc.id,
                    title: data.title,
                    author: data.author,
                    date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    status: data.status,
                    content: data.content,
                    imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop",
                    excerpt: data.content.substring(0, 150) + '...',
                    tags: data.tags || [],
                } as BlogPost;
            });
            setPosts(postsData);
            setLoading(false);
        }
        fetchPosts();
    }, []);

  return (
    <>
      <PageBanner title="From Our Blog" imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <div className="grid md:grid-cols-2 gap-8">
        {loading ? (
            <>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
            </>
        ) : (
            posts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))
        )}
      </div>
    </>
  );
}
