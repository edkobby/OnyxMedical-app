

"use client"
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { User, Calendar, Tag } from 'lucide-react';
import { format } from "date-fns";
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import PageBanner from '@/components/page-banner';
import type { BlogPost } from "@/lib/types";
import { toDate } from '@/lib/events';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Skeleton } from '@/components/ui/skeleton';

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const postsCollection = collection(db, "blog");
    const q = query(postsCollection, where("slug", "==", slug), where("status", "==", "Published"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // Convert Timestamps to ISO strings for serialization
    const postData: any = { id: doc.id, ...data };
    for (const key in postData) {
        if (postData[key] && typeof postData[key].toDate === 'function') {
            postData[key] = postData[key].toDate().toISOString();
        }
    }
    
    return postData as BlogPost;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
      if(slug) {
          getPostBySlug(slug).then(data => {
              if(!data) {
                  notFound();
              }
              setPost(data);
              setLoading(false);
          }).catch(err => {
              console.error(err);
              setLoading(false);
              notFound();
          });
      }
  }, [slug]);

  if (loading) {
    return (
        <>
            <PageBanner title="" imageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }]} />
            <div className="bg-background rounded-lg overflow-hidden border border-border/50 shadow-sm">
                <Skeleton className="w-full aspect-[2.5/1]" />
                <div className="p-6 md:p-8 space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                     <div className="flex items-center gap-6">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
        </>
    )
  }

  if (!post) {
    return notFound();
  }

  return (
    <>
      <PageBanner title={post.title} imageSrc={post.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop'} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
      <div className="bg-background rounded-lg overflow-hidden border border-border/50 shadow-sm">
        <div className="relative w-full aspect-[2.5/1] overflow-hidden">
          <Image
            src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="blog post image"
          />
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(toDate(post.date as string), 'PPP')}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                     <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="prose prose-lg max-w-none text-foreground/80">
            {post.content.split('\\n\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
