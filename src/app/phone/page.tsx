
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


export default function Home() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [phoneName, setPhoneName] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash-lite');
  const { toast } = useToast();

  const handleAddPhone = async () => {
    if (!phoneName.trim()) return;

    const queries = phoneName.split(/\s*vs\s*|\s*,\s*/i).map(q => q.trim()).filter(Boolean);

    if (phones.length + queries.length > 3) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: `You can only compare up to 3 phones in total. You are trying to add ${queries.length} more.`,
      });
      return;
    }

    setLoading(true);
    try {
      const newPhonesPromises = queries.map(query => findPhoneSpecs({ query, model }));
      const newPhonesResults = await Promise.all(newPhonesPromises);

      const newPhonesWithId = newPhonesResults.map(phone => ({
        ...phone,
        id: Date.now() + Math.random(), // Add random number to avoid collision on fast adds
      }));

      setPhones(prevPhones => [...prevPhones, ...newPhonesWithId]);
      setPhoneName('');
    } catch (e) {
      const failedQuery = e instanceof Error && (e as any).message?.match(/"(.*?)"/) ? (e as any).message.match(/"(.*?)"/)[1] : phoneName;
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


  const handleRemovePhone = (phoneId: number) => {
    setPhones(prevPhones => prevPhones.filter(p => p.id !== phoneId));
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary-foreground/90 tracking-tight">
          Battle Phone Party
        </h1>
        <p className="mt-2 leading-relaxed text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
        Kamu bisa membandingkan hingga 3 smartphone. Perlu diketahui project ini menggunakan model AI dengan pengetahuan terbatas, maka dari itu kemungkinan teknologi terbaru belum dapat dikenali.
        <br /><span className="text-xs text-muted-foreground font-body">Noted: kalau komparasi tidak berjalan dengan baik atau sepsifikasi tidak benar. <br className="" /> Gunakan penulisan spesifikasi yang detail misal(Samsung A15 5g) dan pilih "Better AI".</span>
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
            placeholder="e.g., 'Google Pixel 6 vs Pixel 6A' atau 'Samsung A15 5G'"
            className="flex-grow"
            disabled={loading || phones.length >= 3}
          />
          <Button onClick={handleAddPhone} disabled={loading || phones.length >= 3 || !phoneName.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : 'Add Character'}
          </Button>
        </div>
        {phones.length >= 3 && <p className="text-sm text-center text-muted-foreground mt-2">tidak dapat menambahkan lagi, hapus salah satu yang telah ditambahkan.</p>}
        <div className="mt-4 flex justify-center">
            <RadioGroup
                value={model}
                onValueChange={setModel}
                className="flex items-center gap-4"
                disabled={loading}
            >
                <Label htmlFor="fast-model" className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="gemini-2.5-flash-lite" id="fast-model" />
                    <span>Fast AI</span>
                </Label>
                <Label htmlFor="better-model" className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="gemini-2.5-flash" id="better-model" />
                    <span>Better AI</span>
                </Label>
            </RadioGroup>
        </div>
      </section>
      
      {phones.length > 0 && (
        <>
          <Separator className="my-12 md:my-16 bg-primary/20 h-0.5" />
          <section>
            <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">The Arena</h2>
            <PhoneComparison phones={phones} onRemovePhone={handleRemovePhone} model={model} />
          </section>
        </>
      )}
    </main>
  );
}
