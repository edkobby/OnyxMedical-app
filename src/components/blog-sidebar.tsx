
"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronRight, Quote } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';
import { format } from "date-fns";
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/types';
import { toDate } from '@/lib/events';
import { Skeleton } from './ui/skeleton';


const categories = [
  { name: 'Blog Three Column', href: '#' },
  { name: 'Latest Post', href: '#' },
  { name: 'Our Blog', href: '#' },
];

const popularTags = ['Cardiac', 'Hope', 'Security', 'Services', 'Standards', 'Test'];

const testimonials = [
  {
    quote: "Pellentesque a massa risus. Cras convallis finibus porta. Integer in ligula leo. Cras quis consequat nisi, at malesuada sapien. Mauris ultrices nisi eget velit bibendum, sit amet euismod mi gravida. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    author: "William Perez",
    location: "Melbourne",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
  }
];

export default function BlogSidebar() {
  const [recentPosts, setRecentPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecentPosts = async (count = 3) => {
        setLoading(true);
        try {
            const postsCollection = collection(db, "blog");
            const q = query(postsCollection, where("status", "==", "Published"), orderBy("createdAt", "desc"), limit(count));
            const querySnapshot = await getDocs(q);
            
            const posts = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    slug: data.slug || doc.id,
                    title: data.title,
                    date: data.date,
                    imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop",
                } as BlogPost;
            });
            setRecentPosts(posts);
        } catch (error) {
            console.error("Error fetching recent posts: ", error);
        } finally {
            setLoading(false);
        }
    }
    fetchRecentPosts();
  }, []);

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-bold font-headline text-foreground mb-4">Search</h3>
        <div className="relative">
          <Input placeholder="Search..." className="pr-10" />
          <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-full">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-bold font-headline text-foreground mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            ))
          ) : (
            recentPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center gap-4 group">
                <Image
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                />
                <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                        {format(toDate(post.date as string), 'PPP')}
                    </p>
                </div>
                </Link>
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-bold font-headline text-foreground mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.name}>
              <Link href={category.href} className="flex items-center justify-between text-muted-foreground hover:text-primary transition-colors">
                <span>{category.name}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-bold font-headline text-foreground mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="p-6 bg-accent text-accent-foreground rounded-lg">
        <h3 className="text-xl font-bold font-headline mb-4">Testimonials</h3>
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <p className="italic text-accent-foreground/80">"{testimonial.quote}"</p>
            <div className="flex items-center gap-4 mt-4">
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-accent-foreground/80">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
