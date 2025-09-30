
"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import * as React from "react";

import {
  Bell,
  Home,
  Calendar,
  Users,
  UserPlus,
  BarChart3,
  BookText,
  Video,
  Newspaper,
  Settings,
  ShieldCheck,
  CalendarDays,
  MessageSquare,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/patients", label: "Patients", icon: Users },
    { href: "/admin/doctors", label: "Doctors", icon: UserPlus },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/billing", label: "Billing", icon: CreditCard },
    { href: "/admin/content", label: "Content", icon: BookText },
    { href: "/admin/telemedicine", label: "Telemedicine", icon: Video },
    { href: "/admin/blog", label: "Blog / News", icon: Newspaper },
    { href: "/admin/events", label: "Events", icon: CalendarDays },
    { href: "/admin/users", label: "User Management", icon: ShieldCheck },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];


interface AdminSidebarProps {
  isMobile?: boolean;
}

export default function AdminSidebar({ isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname();

  const Logo = () => {
    return (
       <Link href="/" className="flex items-center gap-1 font-semibold">
            <Image 
            src="/images/hero/ONYX_logo_cleaned-1 (1)-min.png"
            alt="Onyx Medical Logo" 
            width={45} 
            height={45}
            className="h-10 w-auto"
            />
            {/* <span className="">Onyx Medical & Fertility Center</span> */}
        </Link>
    )
  }

  const renderNavLinks = () => (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navLinks.map(link => (
            <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    (pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))) && "bg-primary/10 text-primary font-semibold"
                )}
            >
                <link.icon className="h-4 w-4" />
                {link.label}
            </Link>
        ))}
    </nav>
  )
  
  if (isMobile) {
    return renderNavLinks();
  }

  return (
    <div className="hidden border-r bg-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-auto py-2">
          {renderNavLinks()}
        </div>
      </div>
    </div>
  )
}
