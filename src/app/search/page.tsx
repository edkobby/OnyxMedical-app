

"use client"
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { collection, getDocs, query, where, collectionGroup } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';


import type { Doctor, BlogPost } from '@/lib/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Stethoscope, Newspaper } from 'lucide-react';

// Define types for search results
type SearchResult = 
  | ({ type: 'doctor' } & Doctor)
  | ({ type: 'blog' } & BlogPost);


function ResultItem({ item }: { item: SearchResult }) {
    if (item.type === 'doctor') {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex gap-4 items-center">
                    <Image src={item.avatar} alt={item.name} width={80} height={80} className="rounded-full object-cover" data-ai-hint="doctor portrait" />
                    <div className="flex-1">
                        <Badge variant="secondary" className="mb-2"><Stethoscope className="mr-1.5 h-3 w-3" /> Doctor</Badge>
                        <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                        <p className="text-muted-foreground">{item.specialty}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/doctors`}>View Profile</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (item.type === 'blog') {
        return (
             <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex gap-4 items-center">
                    <Image src={item.imageUrl || ''} alt={item.title} width={120} height={80} className="rounded-md object-cover" data-ai-hint="blog post" />
                    <div className="flex-1">
                        <Badge variant="secondary" className="mb-2"><Newspaper className="mr-1.5 h-3 w-3" /> Blog Post</Badge>
                        <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1.5"><User className="h-3 w-3" />{item.author}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{format(new Date(item.date as string), 'PPP')}</div>
                        </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/blog/${item.slug}`}>Read More</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return null;
}

function SearchResults({ query: queryTerm }: { query: string }) {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const performSearch = async () => {
        if (!queryTerm) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const searchTerm = queryTerm.toLowerCase();
        
        try {
            // Search Doctors
            const doctorsQuery = query(collection(db, "doctors"));
            const doctorsSnapshot = await getDocs(doctorsQuery);
            const doctors: SearchResult[] = doctorsSnapshot.docs
                .map(doc => ({ id: doc.id, type: 'doctor', ...doc.data() } as SearchResult & { type: 'doctor'}))
                .filter(d => 
                    d.name.toLowerCase().includes(searchTerm) || 
                    d.specialty.toLowerCase().includes(searchTerm)
                );

            // Search Blog Posts
            const blogQuery = query(collection(db, "blog"), where("status", "==", "Published"));
            const blogSnapshot = await getDocs(blogQuery);
            const blogs: SearchResult[] = blogSnapshot.docs
                .map(doc => {
                    const data = doc.data() as BlogPost;
                    return {
                        ...data,
                        id: doc.id,
                        type: 'blog',
                        date: data.date ? new Date(data.date as any).toISOString() : new Date().toISOString(),
                    } as SearchResult & { type: 'blog'}
                })
                .filter(b => 
                    b.title.toLowerCase().includes(searchTerm) || 
                    b.content.toLowerCase().includes(searchTerm) ||
                    (b.tags && b.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                );

            setResults([...doctors, ...blogs]);
        } catch (error) {
            console.error("Search error: ", error);
        } finally {
            setLoading(false);
        }
    }
    performSearch();
  }, [queryTerm]);


  if (loading) {
      return <SearchSkeleton />;
  }

  return (
    <div className="space-y-6">
      {results.length > 0 ? (
        results.map((item) => <ResultItem key={`${item.type}-${item.id}`} item={item} />)
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No results found for "{queryTerm}"</p>
          <p className="mt-2">Try searching for a different term.</p>
        </div>
      )}
    </div>
  );
}

function SearchSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 flex gap-4 items-center">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <div className="bg-background">
          <div className="sticky top-0 z-50">
            <TopBar />
          </div>
          <Header />
          <main>
            <PageBanner
              title={`Search Results for "${query}"`}
              imageSrc="/images/banners/services.jpg"
              breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
            />
            <section className="py-12 md:py-16 lg:py-20">
              <div className="container mx-auto px-4 md:px-6">
                  <SearchResults query={query} />
              </div>
            </section>
          </main>
          <Footer />
        </div>
    )
}


export default function SearchPage() {
    return (
        <Suspense fallback={<SearchSkeleton />}>
            <SearchPageContent />
        </Suspense>
    )
}
