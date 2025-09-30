"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Leaf, Transplant, Syringe, Users } from 'lucide-react';

const counters = [
    { value: 168, label: "Successful Transplants" },
    { value: 25, label: "Branches worldwide" },
    { value: 245, label: "Satisfied Patients" },
    { value: 100, label: "Professional Doctors" },
];

const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const startTime = performance.now();
                    const animate = (currentTime: number) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        start = Math.floor(progress * end);
                        setCount(start);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref} className="text-4xl md:text-5xl font-bold font-headline">{count.toLocaleString()}</span>;
};


export default function Counters() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-accent text-accent-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {counters.map((counter, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <Counter end={counter.value} />
                            <p className="text-lg font-medium uppercase font-headline">{counter.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
