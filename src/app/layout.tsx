import type {Metadata} from 'next';
import './globals.css';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import Footer from '@/components/footer';
import { Swords, PartyPopper } from 'lucide-react';
import { ThemeProvider } from '@/components/providers';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'Kaum Mendang Mending',
  description: 'Khusus untuk kalian yang gemar menimbang, membandingkan, dan mencari suatu nilai terbaik dari teknologi yang belum tentu kalian beli!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
        >
            <header className="bg-card/95 backdrop-blur-sm sticky top-0 z-50 w-full border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="text-2xl font-headline font-bold text-foreground hover:opacity-80 transition-opacity">
                      <Swords className="inline-block mr-2" size={28} />
                        BATTLE PARTY 
                      <PartyPopper className="inline-block ml-2" size={28}/>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            <div className="flex-grow">
              {children}
            </div>
            
            <Footer />
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
