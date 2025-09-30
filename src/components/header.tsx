
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/telemedicine", label: "Telemedicine" },
  { href: "/blog", label: "Blog" },
];

const pageLinks = [
    { href: "/about", label: "About Us" },
    { href: "/doctors", label: "Our Doctors" },
    { href: "/departments", label: "Departments" },
    { href: "/appointment", label: "Appointment" },
    { href: "/gallery", label: "Gallery" },
    { href: "/pricing", label: "Pricing" },
    { href: "/calendar", label: "Calendar" },
    { href: "/faq", label: "FAQ" },
    { href: "/shortcodes", label: "Shortcodes" },
];

const contactLink = { href: "/contact", label: "Contact Us" };


export default function Header() {
  const [open, setOpen] = React.useState(false)
  const [isPagesMenuOpen, setIsPagesMenuOpen] = React.useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2" onClick={() => open && setOpen(false)}>
            <Image 
                src="/images/hero/ONYX_logo_cleaned-1 (1)-min.png"
                alt="Onyx Medical Logo" 
                width={48} 
                height={48}
                className="h-10 md:h-11 w-auto"
                priority
            />
        </Link>
    );
  };

  return (
    <header className="w-full bg-background shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {mainNavLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="font-headline uppercase text-foreground/80 transition-colors hover:text-primary font-bold text-base"
            >
              {label}
            </Link>
          ))}

          <DropdownMenu open={isPagesMenuOpen} onOpenChange={setIsPagesMenuOpen}>
            <div onMouseEnter={() => setIsPagesMenuOpen(true)} onMouseLeave={() => setIsPagesMenuOpen(false)} className="h-full flex items-center">
              <DropdownMenuTrigger asChild>
                <Link href="#" className="flex items-center gap-1 font-headline uppercase text-foreground/80 transition-colors hover:text-primary font-bold text-base focus:outline-none">
                  Pages <ChevronDown className="h-4 w-4" />
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent onMouseEnter={() => setIsPagesMenuOpen(true)} onMouseLeave={() => setIsPagesMenuOpen(false)} className="data-[state=open]:animate-fade-in-pop">
                {pageLinks.map(({href, label}) => (
                  <DropdownMenuItem key={label} asChild>
                    <Link href={href}>{label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </div>
          </DropdownMenu>

          <Link
            href={contactLink.href}
            className="font-headline uppercase text-foreground/80 transition-colors hover:text-primary font-bold text-base"
          >
            {contactLink.label}
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-6 w-6 text-foreground/80" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <form onSubmit={handleSearchSubmit} className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Search for services, doctors, or articles.
                    </p>
                  </div>
                  <div className="relative">
                     <Input
                        id="search"
                        placeholder="Type to search..."
                        className="pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" variant="ghost" size="icon" className="absolute top-0 right-0 h-full w-10 text-muted-foreground">
                        <Search className="h-5 w-5" />
                      </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          <Button asChild variant="accent">
            <Link href="/appointment">Appointment</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-2">
           <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5 text-foreground/80" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <form onSubmit={handleSearchSubmit} className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Search for services, doctors, or articles.
                    </p>
                  </div>
                  <div className="relative">
                     <Input
                        id="search-mobile"
                        placeholder="Type to search..."
                        className="pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" variant="ghost" size="icon" className="absolute top-0 right-0 h-full w-10 text-muted-foreground">
                        <Search className="h-5 w-5" />
                      </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-3/4 bg-background p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
                   <Logo />
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetHeader>
                <nav className="flex-grow flex flex-col items-start p-6 gap-2 text-lg font-medium">
                  {mainNavLinks.map(({ href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      className="w-full py-2 text-foreground/80 transition-colors hover:text-primary font-headline uppercase"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <Collapsible className="w-full">
                    <CollapsibleTrigger className="w-full flex items-center justify-between py-2 text-foreground/80 transition-colors hover:text-primary font-headline uppercase">
                      Pages <ChevronDown className="h-5 w-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      {pageLinks.map(({ href, label }) => (
                         <Link
                          key={label}
                          href={href}
                          className="block w-full py-2 text-foreground/70 transition-colors hover:text-primary font-headline text-base"
                          onClick={() => setOpen(false)}
                        >
                          {label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                   <Link
                      href={contactLink.href}
                      className="w-full py-2 text-foreground/80 transition-colors hover:text-primary font-headline uppercase"
                      onClick={() => setOpen(false)}
                    >
                      {contactLink.label}
                    </Link>
                </nav>
                 <div className="p-6 border-t">
                  <Button asChild className="w-full" variant="accent" onClick={() => setOpen(false)}>
                    <Link href="/appointment">Appointment</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
