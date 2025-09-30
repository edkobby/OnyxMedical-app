
import type { Metadata } from 'next';
import './globals.css';
import 'aos/dist/aos.css';
import { Toaster } from "@/components/ui/toaster"
import { Montserrat, Open_Sans } from 'next/font/google'
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-context';
import AOSProvider from '@/context/aos-provider';
import PromoModal from '@/components/promo-modal';

export const metadata: Metadata = {
  title: 'Onyx Medical & Fertility Center',
  description: 'We Set the Standards Others Try to Live Up To',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-headline',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={cn("font-body antialiased text-foreground bg-background", montserrat.variable, openSans.variable)} suppressHydrationWarning>
        <div className="overflow-x-hidden">
          <AuthProvider>
            <AOSProvider>
              {children}
              <PromoModal />
            </AOSProvider>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
