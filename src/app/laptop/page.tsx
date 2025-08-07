
"use client";

import { useState } from 'react';
import type { Laptop } from '@/lib/types';
import LaptopComparison from '@/components/laptop-comparison';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findLaptopSpecs } from '@/ai/flows/find-laptop-specs';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function LaptopPage() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [laptopName, setLaptopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash-lite');
  const { toast } = useToast();

  const handleAddLaptop = async () => {
    if (!laptopName.trim()) return;

    const queries = laptopName.split(/\s*vs\s*|\s*,\s*/i).map(q => q.trim()).filter(Boolean);
    
    if (laptops.length + queries.length > 3) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: `You can only compare up to 3 laptops in total. You are trying to add ${queries.length} more.`,
      });
      return;
    }

    setLoading(true);
    try {
      const newLaptopsPromises = queries.map(query => findLaptopSpecs({ query, model }));
      const newLaptopsResults = await Promise.all(newLaptopsPromises);
      
      const newLaptopsWithId = newLaptopsResults.map(laptop => ({
        ...laptop,
        id: Date.now() + Math.random(), // Add random number to avoid collision on fast adds
      }));

      setLaptops(prevLaptops => [...prevLaptops, ...newLaptopsWithId]);
      setLaptopName('');
    } catch (e) {
      const failedQuery = e instanceof Error && (e as any).message?.match(/"(.*?)"/) ? (e as any).message.match(/"(.*?)"/)[1] : laptopName;
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Could not find specs for "${failedQuery}". Please try a different name.`,
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLaptop = (laptopId: number) => {
    setLaptops(prevLaptops => prevLaptops.filter(p => p.id !== laptopId));
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary-foreground/90 tracking-tight">
          Battle Laptop Party
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
        Kamu bisa membandingkan hingga 3 smartphone, kenapa cuma 3? soalnya keterbatasan AI dalam membandingkannya.
          <br /><span className="text-sm text-muted-foreground font-body">Noted: Kalau komspanarasi tidak berjalan dengan baik, hapus salah satu yang telah ditambahkan.</span>
        </p>
      </header>
      
      <section className="max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">Add Your Fighter</h2>
        <div className="flex items-center gap-2">
          <Input 
            type="text"
            value={laptopName}
            onChange={(e) => setLaptopName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleAddLaptop()}
            placeholder="e.g., 'Macbook Air M3' or 'Dell XPS 13, Surface Laptop 5'"
            className="flex-grow"
            disabled={loading || laptops.length >= 3}
          />
          <Button onClick={handleAddLaptop} disabled={loading || laptops.length >= 3 || !laptopName.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : 'Add Character'}
          </Button>
        </div>
        {laptops.length >= 3 && <p className="text-sm text-center text-muted-foreground mt-2">tidak dapat menambahkan lagi, hapus salah satu yang telah ditambahkan.</p>}

        <div className="mt-4 flex justify-center">
            <RadioGroup
                value={model}
                onValueChange={setModel}
                className="flex items-center gap-4"
                disabled={loading}
            >
                <Label htmlFor="fast-model" className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="gemini-2.5-flash-lite" id="fast-model" />
                    <span>Cepat</span>
                </Label>
                <Label htmlFor="better-model" className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="gemini-2.5-flash" id="better-model" />
                    <span>Lebih Baik</span>
                </Label>
            </RadioGroup>
        </div>
      </section>
      
      {laptops.length > 0 && (
        <>
          <Separator className="my-12 md:my-16 bg-primary/20 h-0.5" />
          <section>
            <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">The Arena</h2>
            <LaptopComparison laptops={laptops} onRemoveLaptop={handleRemoveLaptop} model={model} />
          </section>
        </>
      )}
    </main>
  );
}
