import type {Metadata} from 'next';
import './globals.css';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <header className="absolute p-4">
          <Link href="/"><Home size={24} /></Link>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
