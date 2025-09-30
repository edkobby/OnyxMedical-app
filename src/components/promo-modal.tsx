
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, CalendarCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function PromoModal() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    // Check if the modal has been shown in this session
    const hasBeenShown = sessionStorage.getItem("promoModalShown")
    if (!hasBeenShown) {
      // If not shown, open the modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
        sessionStorage.setItem("promoModalShown", "true")
      }, 1500) // 1.5-second delay before showing

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => setIsOpen(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="relative w-full h-48 md:h-56 bg-gray-200 flex items-center justify-center">
                <Image
                    src="/images/showcase/laparoscopy2.webp"
                    alt="Advanced medical services"
                    fill
                    className="object-cover"
                    data-ai-hint="medical technology"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-gray-400">Promo Image</p>
                </div>
            </div>

            <div className="p-6 md:p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground">
                    Introducing Advanced Laparoscopy & Hysteroscopy Services
                </h2>
                <p className="mt-3 text-muted-foreground">
                    Onyx Medical & Fertility Center is now offering minimally invasive laparoscopic and hysteroscopic procedures for safer, faster recovery and advanced fertility care.
                </p>
                <Button asChild size="lg" variant="accent" className="mt-6 w-full sm:w-auto">
                    <Link href="/appointment">
                        <CalendarCheck className="mr-2 h-5 w-5"/>
                        Book Appointment
                    </Link>
                </Button>
            </div>
            
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 rounded-full p-1.5 text-gray-500 bg-white/70 hover:bg-white hover:text-gray-800 transition-colors"
                aria-label="Close modal"
            >
                <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
