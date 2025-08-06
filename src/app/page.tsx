
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Smartphone, Laptop } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary-foreground/90 tracking-tight">
            Kaum Mendang Mending
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground font-body max-w-3xl mx-auto">
            Selamat datang, para pejuang mendang-mending! Di sini adalah arena pertarungan ponsel dan laptop bagi kalian yang gemar menimbang, membandingkan, dan mencari suatu nilai terbaik dari teknologi yang belum tentu kalian beli!
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 font-headline text-3xl">
                <Smartphone className="size-8 text-primary" />
                <span>Battle Phone</span>
              </CardTitle>
              <CardDescription className="font-body">
              Bandingkan smartphone dari berbagai merk dan temukan jawara yang spek-nya bantu kamu makin jadi pintar nge-scroll.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full hover:bg-primary hover:shadow-md hover:outline hover:outline-accent transition-shadow">
                <Link href="/phone">Mulai Bandingkan Ponsel</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 font-headline text-3xl">
                <Laptop className="size-8 text-accent" />
                <span>Battle Laptop</span>
              </CardTitle>
              <CardDescription className="font-body">
                Adu spesifikasi laptop lebih mendalam, dari prosesor hingga kualitas layar, untuk menemukan mesin nonton anime terbaik.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent hover:shadow-md hover:outline hover:outline-primary transition-shadow">
                <Link href="/laptop">Mulai Bandingkan Laptop</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}