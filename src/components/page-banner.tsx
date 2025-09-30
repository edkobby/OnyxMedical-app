
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  imageSrc?: string;
}

export default function PageBanner({ title, breadcrumbs, imageSrc }: PageBannerProps) {
  return (
    <section className="relative w-full h-[40vh] min-h-[300px]">
      <Image
        src={imageSrc || "/images/banners/mom&baby-min.jpg"}
        alt={title}
        fill
        className="object-cover brightness-50"
        data-ai-hint="hospital reception"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-5xl md:text-6xl font-bold font-headline uppercase">
          {title}
        </h1>
        <div className="mt-4 flex items-center text-lg">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-accent transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-muted-foreground">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-5 w-5 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
