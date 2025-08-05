
"use client";

import { useState } from 'react';
import type { Phone, Spec } from '@/lib/types';
import { specLabels } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, X } from 'lucide-react';
import { Button } from './ui/button';

interface PhoneComparisonProps {
  phones: Phone[];
  onRemovePhone: (phoneId: number) => void;
}

// Helper to extract a number from a spec string (e.g., "Rp 15.000.000" -> 15000000)
const getNumericValue = (spec: string): number => {
  if (!spec) return 0;
  const match = spec.replace(/[^0-9]/g, ''); // Keep only numbers
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
    
    const currentNumeric = getNumericValue(currentSpec);
    const bestNumeric = getNumericValue(bestSpec);

    if (currentNumeric === 0 && bestNumeric === 0) continue; // Skip if values can't be parsed

    if (isPrice) {
      // For price, a lower non-zero value is better
      if (currentNumeric > 0 && (bestNumeric === 0 || currentNumeric < bestNumeric)) {
        bestPhone = phones[i];
      }
    } else {
      // For other specs, a higher value is better
      if (currentNumeric > bestNumeric) {
        bestPhone = phones[i];
      }
    }
  }

  // Check if there is a clear winner (no ties)
  let bestValue = bestPhone.specs[specKey];
  let bestNumericValue = getNumericValue(bestValue);
  
  // No winner if the best value is 0 (except for price)
  if (bestNumericValue === 0 && !isPrice) return null; 

  const isTie = phones.some(p => {
    let pValue = p.specs[specKey];
    let pNumericValue = getNumericValue(pValue);
    return p.id !== bestPhone.id && pNumericValue === bestNumericValue;
  });

  return isTie ? null : bestValue;
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
    { label: "Comms", keys: ['nfc', 'ipRating', 'sim', 'usb'], isCompact: true },
    { label: specLabels.sensors, keys: ['sensors'], isCompact: false },
    { label: "Battery", keys: ['batteryType', 'batteryCharging'], isCompact: true },
    { label: specLabels.price, keys: ['price'], isCompact: false },
];


export default function PhoneComparison({ phones, onRemovePhone }: PhoneComparisonProps) {
  if (phones.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border-2 border-dashed">
        <h3 className="font-headline text-2xl">The Stage is Set...</h3>
        <p className="text-muted-foreground font-body">Add a phone to begin the battle!</p>
      </div>
    );
  }

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
                <TableHead className="w-[180px] font-headline text-lg text-primary-foreground/90 align-bottom">Feature</TableHead>
                {phones.map(phone => (
                  <TableHead key={phone.id} className="text-center font-headline text-lg text-primary-foreground/90 relative group align-bottom">
                    <div className="flex flex-col items-center justify-end gap-1 min-h-[80px]">
                      <div className="flex items-start gap-1">
                        <span className="font-bold">{phone.model}</span>
                        <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemovePhone(phone.id)}>
                          <X className="size-4"/>
                        </Button>
                      </div>
                      <div className="text-sm font-body text-muted-foreground">
                        <p>{phone.brand}</p>
                        <p className="text-xs">{phone.specs.color}</p>
                      </div>
                    </div>
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
                            <div className="flex items-start justify-center gap-2 font-body text-base">
                              {isBest && <Trophy className="w-4 h-4 shrink-0 mt-1" />}
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
    </div>
  );
}
