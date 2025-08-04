"use client";

import type { Phone, Spec } from '@/data/phones';
import { specLabels } from '@/data/phones';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import ReviewSummary from './review-summary';

interface PhoneComparisonProps {
  phones: Phone[];
}

// Helper to extract a number from a spec string (e.g., "5050 mAh" -> 5050)
const getNumericValue = (spec: string): number => {
  const match = spec.replace(/[^0-9.]/g, '');
  return match ? parseFloat(match) : 0;
};

// Helper to find the best spec among the selected phones
const getBestSpec = (specKey: keyof Spec, phones: Phone[]): string | null => {
  if (phones.length < 2) return null;

  // For price, lower is better. For others, higher is better.
  const isPrice = specKey === 'price';
  let bestPhone = phones[0];

  for (let i = 1; i < phones.length; i++) {
    const currentSpec = phones[i].specs[specKey];
    const bestSpec = bestPhone.specs[specKey];

    // Handle special cases that are not simple numeric comparisons
    if (specKey === 'batteryType') {
        const currentNumeric = getNumericValue(currentSpec);
        const bestNumeric = getNumericValue(bestSpec);
        if (currentNumeric > bestNumeric) {
            bestPhone = phones[i];
        }
        continue;
    }
    
    // Default numeric comparison
    const currentNumeric = getNumericValue(currentSpec);
    const bestNumeric = getNumericValue(bestSpec);

    if (currentNumeric === 0 && bestNumeric === 0) continue; // Skip non-numeric specs

    if (isPrice) {
      if (currentNumeric < bestNumeric) {
        bestPhone = phones[i];
      }
    } else {
      if (currentNumeric > bestNumeric) {
        bestPhone = phones[i];
      }
    }
  }

  // Check if there is a clear winner (no ties)
  let bestValue = bestPhone.specs[specKey];
  if (specKey === 'batteryType') {
    bestValue = getNumericValue(bestValue).toString();
  } else {
    bestValue = getNumericValue(bestValue).toString();
  }
  
  if (bestValue === '0' && specKey !== 'price') return null; // No winner for non-numeric specs

  const isTie = phones.some(p => {
    let pValue = p.specs[specKey];
    if (specKey === 'batteryType') {
        pValue = getNumericValue(pValue).toString();
    } else {
        pValue = getNumericValue(pValue).toString();
    }
    return p.id !== bestPhone.id && pValue === bestValue;
  });


  return isTie ? null : bestPhone.specs[specKey];
};

type SpecGroup = {
    label: string;
    keys: (keyof Spec)[];
    isCompact: boolean;
};

const specStructure: SpecGroup[] = [
    { label: specLabels.announced, keys: ['announced'], isCompact: false },
    { label: "Display", keys: ['displaySize', 'displayResolution', 'displayProtection'], isCompact: true },
    { label: "Platform", keys: ['os', 'osUpdate', 'processorChipset', 'processorCpu', 'processorGpu'], isCompact: true },
    { label: specLabels.storageRam, keys: ['storageRam'], isCompact: false },
    { label: "Main Camera", keys: ['mainCameraModules', 'mainCameraFeatures', 'mainCameraVideo'], isCompact: true },
    { label: "Selfie Camera", keys: ['selfieCameraModules', 'selfieCameraFeatures', 'selfieCameraVideo'], isCompact: true },
    { label: specLabels.nfc, keys: ['nfc'], isCompact: false },
    { label: specLabels.usb, keys: ['usb'], isCompact: false },
    { label: specLabels.sensors, keys: ['sensors'], isCompact: false },
    { label: "Battery", keys: ['batteryType', 'batteryCharging'], isCompact: true },
    { label: specLabels.price, keys: ['price'], isCompact: false },
];


export default function PhoneComparison({ phones }: PhoneComparisonProps) {
  if (phones.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border-2 border-dashed">
        <h3 className="font-headline text-2xl">The Stage is Set...</h3>
        <p className="text-muted-foreground font-body">Select at least one phone to see its stats.</p>
      </div>
    );
  }

  const gridColsClass = 
    phones.length === 1 ? 'md:grid-cols-1' :
    phones.length === 2 ? 'md:grid-cols-2' :
    phones.length === 3 ? 'lg:grid-cols-3' :
    'lg:grid-cols-2 xl:grid-cols-4';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Spec Showdown</CardTitle>
          <CardDescription className="font-body">Side-by-side comparison. The best spec in each row gets a trophy!</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] font-headline text-lg text-primary-foreground/90">Feature</TableHead>
                {phones.map(phone => (
                  <TableHead key={phone.id} className="text-center font-headline text-lg text-primary-foreground/90">
                    {phone.model}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {specStructure.map((group, index) => {
                const bestSpecValue = !group.isCompact ? getBestSpec(group.keys[0], phones) : null;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-bold font-body align-top">{group.label}</TableCell>
                    {phones.map(phone => {
                      const isBest = !group.isCompact && phone.specs[group.keys[0]] === bestSpecValue;
                      return (
                        <TableCell key={phone.id} className={`text-center transition-all text-xs ${isBest ? 'bg-accent/10' : ''}`}>
                          <div className={`inline-block p-2 rounded-md w-full text-left ${isBest ? 'bg-accent text-accent-foreground shadow-lg' : ''}`}>
                            <div className="flex items-center justify-center gap-2 font-body text-base">
                              {isBest && <Trophy className="w-4 h-4 shrink-0" />}
                              <div className='w-full'>
                                {group.keys.map(key => (
                                    <p key={key} className="text-sm">
                                      {group.isCompact && <span className="font-semibold">{specLabels[key]}: </span>}
                                      {phone.specs[key]}
                                    </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Review Rumble</CardTitle>
          <CardDescription className="font-body">Here's what the crowd is saying, summarized by our AI expert.</CardDescription>
        </CardHeader>
        <CardContent className={`grid gap-6 grid-cols-1 ${gridColsClass}`}>
          {phones.map(phone => (
            <Card key={phone.id} className="bg-background flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-center">{phone.model}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ReviewSummary phoneModel={phone.model} reviews={phone.reviews} />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
