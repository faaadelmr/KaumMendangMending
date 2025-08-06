
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

export default function LaptopPage() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [laptopName, setLaptopName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddLaptop = async () => {
    if (!laptopName.trim()) return;
    if (laptops.length >= 4) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You can only compare up to 4 laptops.",
      });
      return;
    }
    setLoading(true);
    try {
      const newLaptop = await findLaptopSpecs({ query: laptopName });
      // The AI doesn't return an ID, so we add one.
      setLaptops(prevLaptops => [...prevLaptops, { ...newLaptop, id: Date.now() }]);
      setLaptopName('');
    } catch (e) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Could not find specs for "${laptopName}". Please try a different name.`,
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
          Add up to 4 laptops by name to see a side-by-side spec showdown.
        </p>
      </header>
      
      <section className="max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">Add Your Contender</h2>
        <div className="flex items-center gap-2">
          <Input 
            type="text"
            value={laptopName}
            onChange={(e) => setLaptopName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleAddLaptop()}
            placeholder="e.g., 'Macbook Pro M3' or 'Latest Dell XPS'"
            className="flex-grow"
            disabled={loading || laptops.length >= 4}
          />
          <Button onClick={handleAddLaptop} disabled={loading || laptops.length >= 4 || !laptopName.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : 'Add Laptop'}
          </Button>
        </div>
        {laptops.length >= 4 && <p className="text-sm text-center text-muted-foreground mt-2">Selection limit reached.</p>}
      </section>
      
      {laptops.length > 0 && (
        <>
          <Separator className="my-12 md:my-16 bg-primary/20 h-0.5" />
          <section>
            <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">The Arena</h2>
            <LaptopComparison laptops={laptops} onRemoveLaptop={handleRemoveLaptop} />
          </section>
        </>
      )}
    </main>
  );
}
