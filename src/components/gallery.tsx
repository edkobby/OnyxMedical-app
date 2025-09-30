
"use client"

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { galleryImages, galleryCategories } from '@/lib/gallery';

const IMAGES_TO_SHOW_INITIALLY = 8;
const IMAGES_TO_LOAD_MORE = 4;

export default function Gallery() {
  const [filter, setFilter] = React.useState('All');
  const [visibleCount, setVisibleCount] = React.useState(IMAGES_TO_SHOW_INITIALLY);

  const filteredImages = React.useMemo(() => 
    galleryImages.filter(image => filter === 'All' || image.category === filter), 
    [filter]
  );
  
  const visibleImages = filteredImages.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + IMAGES_TO_LOAD_MORE);
  };
  
  const handleFilterChange = (category: string) => {
    setFilter(category);
    setVisibleCount(IMAGES_TO_SHOW_INITIALLY);
  };

  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline uppercase">Support Gallery</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline uppercase text-foreground">We Offer You The Best Support</h2>
        </div>

        <div className="flex justify-center flex-wrap gap-2 my-12">
          {galleryCategories.map(category => (
            <Button
              key={category}
              variant={filter === category ? 'accent' : 'outline'}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <AnimatePresence>
            <motion.div 
                layout 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {visibleImages.map((image, index) => (
                    <motion.div
                        key={`${image.src}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="relative group overflow-hidden aspect-video rounded-lg shadow-md"
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            data-ai-hint={image.hint}
                        />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors" />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>

        {visibleCount < filteredImages.length && (
          <div className="text-center mt-12">
            <Button onClick={handleLoadMore} size="lg" variant="accent">
              View More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
