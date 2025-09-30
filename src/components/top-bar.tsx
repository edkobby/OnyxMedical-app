
import { Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { WhatsappIcon } from "./whatsapp-icon";
import { FacebookIcon } from "./facebook-icon";
import { XIcon } from "./x-icon";
import { InstagramIcon } from "./instagram-icon";

export default function TopBar() {
    return (
        <div className="bg-foreground text-background/80 py-2 text-sm">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Left side: Contact Info */}
                <div className="hidden sm:flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2">
                        <Mail className="w-4 h-4 text-accent" />
                        <Link href="mailto:onyxmfc21@gmail.com" className="hover:text-accent transition-colors">
                            onyxmfc21@gmail.com
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        <Link href="tel:0558101129" className="hover:text-accent transition-colors">
                            0558101129
                        </Link>
                    </div>
                </div>

                {/* Social icons on mobile (left side) */}
                 <div className="flex items-center gap-2 sm:hidden">
                    <a href="https://web.facebook.com/people/Onyx-Medical-and-Fertility-Centre/100090525152743/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><FacebookIcon className="h-4 w-4" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><XIcon className="h-4 w-4" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><InstagramIcon className="h-4 w-4" /></a>
                    <a href="https://wa.me/233503671770" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><WhatsappIcon className="h-4 w-4" /></a>
                </div>

                {/* Right side: Socials (desktop) + Account */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                         <a href="https://web.facebook.com/people/Onyx-Medical-and-Fertility-Centre/100090525152743/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><FacebookIcon className="h-4 w-4" /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><XIcon className="h-4 w-4" /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><InstagramIcon className="h-4 w-4" /></a>
                        <a href="https://wa.me/233503671770" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors"><WhatsappIcon className="h-4 w-4" /></a>
                    </div>
                    <div className="border-l h-4 border-background/50"></div>
                    <Button asChild variant="ghost" size="sm" className="text-xs h-auto p-1.5 hover:bg-white/10 hover:text-accent">
                         <Link href="/auth" className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            Account
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
