"use client";

import { useState } from 'react';
import type { Phone } from '@/data/phones';
import { phones as allPhones } from '@/data/phones';
import PhoneSelector from '@/components/phone-selector';
import PhoneComparison from '@/components/phone-comparison';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [selectedPhoneIds, setSelectedPhoneIds] = useState<number[]>([]);

  const handlePhoneSelectionChange = (phoneId: number, isSelected: boolean) => {
    setSelectedPhoneIds(prevIds => {
      // Limit selection to 4 phones for optimal comparison view
      if (isSelected && prevIds.length >= 4) {
        // Here you could show a toast notification
        console.log("You can only select up to 4 phones.");
        return prevIds;
      }
      if (isSelected) {
        return [...prevIds, phoneId];
      } else {
        return prevIds.filter(id => id !== phoneId);
      }
    });
  };

  const selectedPhones = allPhones.filter(phone => selectedPhoneIds.includes(phone.id));

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary-foreground/90 tracking-tight">
          Battle Phone Party
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
          Choose your contenders! Select up to 4 phones to see a side-by-side spec showdown and find your next champion.
        </p>
      </header>
      
      <section>
        <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">Select Your Fighters</h2>
        <PhoneSelector
          phones={allPhones}
          selectedPhoneIds={selectedPhoneIds}
          onPhoneSelectionChange={handlePhoneSelectionChange}
          selectionLimitReached={selectedPhoneIds.length >= 4}
        />
      </section>
      
      {selectedPhones.length > 0 && (
        <>
          <Separator className="my-12 md:my-16 bg-primary/20 h-0.5" />
          <section>
            <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-center">The Arena</h2>
            <PhoneComparison phones={selectedPhones} />
          </section>
        </>
      )}
    </main>
  );
}
