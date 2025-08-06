
"use client";

import { useState } from 'react';
import type { Phone } from '@/lib/types';
import PhoneComparison from '@/components/phone-comparison';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findPhoneSpecs } from '@/ai/flows/find-phone-specs';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [phoneName, setPhoneName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddPhone = async () => {
    if (!phoneName.trim()) return;
    if (phones.length >= 4) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You can only compare up to 4 phones.",
      });
      return;
    }
    setLoading(true);
    try {
      const newPhone = await findPhoneSpecs({ query: phoneName });
      // The AI doesn't return an ID, so we add one.
      setPhones(prevPhones => [...prevPhones, { ...newPhone, id: Date.now() }]);
      setPhoneName('');
    } catch (e) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Could not find specs for "${phoneName}". Please try a different name.`,
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhone = (phoneId: number) => {
    setPhones(prevPhones => prevPhones.filter(p => p.id !== phoneId));
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary-foreground/90 tracking-tight">
          Battle Phone Party
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
          Add up to 4 phones by name to see a side-by-side spec showdown and an AI-powered review summary.
        </p>
      </header>
      
      <section className="max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">Add Your Fighter</h2>
        <div className="flex items-center gap-2">
          <Input 
            type="text"
            value={phoneName}
            onChange={(e) => setPhoneName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleAddPhone()}
            placeholder="e.g., 'Pixel 8 Pro' or 'Latest iPhone'"
            className="flex-grow"
            disabled={loading || phones.length >= 4}
          />
          <Button onClick={handleAddPhone} disabled={loading || phones.length >= 4 || !phoneName.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : 'Add Phone'}
          </Button>
        </div>
        {phones.length >= 4 && <p className="text-sm text-center text-muted-foreground mt-2">Selection limit reached.</p>}
      </section>
      
      {phones.length > 0 && (
        <>
          <Separator className="my-12 md:my-16 bg-primary/20 h-0.5" />
          <section>
            <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">The Arena</h2>
            <PhoneComparison phones={phones} onRemovePhone={handleRemovePhone} />
          </section>
        </>
      )}
    </main>
  );
}
