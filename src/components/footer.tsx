
import Link from 'next/link';
import { WhatsappIcon } from './whatsapp-icon';
import { FacebookIcon } from './facebook-icon';
import { XIcon } from './x-icon';
import { InstagramIcon } from './instagram-icon';

const quickLinks = [
  { text: 'Home', href: '/' },
  { text: 'About Us', href: '/about' },
  { text: 'Our Services', href: '/services' },
  { text: 'Our Doctors', href: '/doctors' },
  { text: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { text: 'Fertility Care', href: '/services' },
  { text: 'Gynecology', href: '/services' },
  { text: 'General Surgery', href: '/services' },
  { text: 'Laboratory', href: '/services' },
  { text: 'Pediatrics', href: '/services' },
  { text: 'Ultrasound Scan', href: '/services' },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-headline uppercase text-white">About Us</h3>
            <p>
              Your trusted partner in health and fertility. We provide world-class medical services with a compassionate touch.
            </p>
             <div className="flex items-center gap-4 pt-2">
                <a href="https://web.facebook.com/people/Onyx-Medical-and-Fertility-Centre/100090525152743/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors">
                    <FacebookIcon className="h-5 w-5" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors">
                    <XIcon className="h-5 w-5" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors">
                    <InstagramIcon className="h-5 w-5" />
                </a>
                 <a href="https://wa.me/233503671770" target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent transition-colors">
                    <WhatsappIcon className="h-5 w-5" />
                </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-headline uppercase text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    &raquo; {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-headline uppercase text-white">Our Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    &raquo; {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-headline uppercase text-white">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="font-bold text-accent">Address:</span>
                <span>P.O.Box AE 15, Atomic, Accra</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-accent">Phone:</span>
                <div className="flex flex-col">
                  <a href="tel:0503671770" className="hover:text-accent transition-colors">0503671770</a>
                  <a href="tel:0558101129" className="hover:text-accent transition-colors">0558101129</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-accent">Email:</span>
                <a href="mailto:onyxmfc21@gmail.com" className="hover:text-accent transition-colors">onyxmfc21@gmail.com</a>
              </li>
               <li className="flex items-start gap-3">
                <span className="font-bold text-accent">WhatsApp:</span>
                <a href="https://wa.me/233503671770" target="_blank" className="hover:text-accent transition-colors flex items-center gap-2">
                    <WhatsappIcon className="h-5 w-5" /> Chat with us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-background/20 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Onyx Medical & Fertility Center. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
