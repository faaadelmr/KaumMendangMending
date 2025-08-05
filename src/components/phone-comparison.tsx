
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Phone, Spec } from '@/lib/types';
import { specLabels } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, X } from 'lucide-react';
import { Button } from './ui/button';
import { compareAllSpecs, type Winners } from '@/ai/flows/compare-specs';
import { Skeleton } from '@/components/ui/skeleton';


interface PhoneComparisonProps {
  phones: Phone[];
  onRemovePhone: (phoneId: number) => void;
}

type SpecGroup = {
    label: string;
    keys: (keyof Spec)[];
    isCompact: boolean;
};

const specStructure: SpecGroup[] = [
    { label: specLabels.price, keys: ['price'], isCompact: false },
    { label: specLabels.announced, keys: ['announced'], isCompact: false },
    { label: "Display", keys: ['displaySize', 'displayResolution', 'displayProtection'], isCompact: true },
    { label: "Platform", keys: ['os', 'osUpdate', 'processorChipset', 'processorCpu', 'processorGpu'], isCompact: true },
    { label: specLabels.storageRam, keys: ['storageRam'], isCompact: false },
    { label: "Main Camera", keys: ['mainCameraModules', 'mainCameraFeatures', 'mainCameraVideo'], isCompact: true },
    { label: "Selfie Camera", keys: ['selfieCameraModules', 'selfieCameraFeatures', 'selfieCameraVideo'], isCompact: true },
    { label: "Comms", keys: ['nfc', 'ipRating', 'sim', 'usb'], isCompact: true },
    { label: specLabels.sensors, keys: ['sensors'], isCompact: false },
    { label: "Battery", keys: ['batteryType', 'batteryCharging'], isCompact: true },
];


export default function PhoneComparison({ phones, onRemovePhone }: PhoneComparisonProps) {
  const [winners, setWinners] = useState<Winners>({});
  const [loading, setLoading] = useState(false);

  const getWinners = useCallback(async () => {
    if (phones.length < 2) {
      setWinners({});
      return;
    }
    setLoading(true);
    try {
      const result = await compareAllSpecs({ phones });
      setWinners(result);
    } catch (error) {
      console.error("Failed to get AI comparison:", error);
      // Handle error appropriately, maybe show a toast
    } finally {
      setLoading(false);
    }
  }, [phones]);

  useEffect(() => {
    getWinners();
  }, [getWinners]);


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
          <CardDescription className="font-body">Side-by-side comparison. The best spec in each row gets an AI-powered trophy!</CardDescription>
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
              {loading && phones.length > 1 && (
                specStructure.map((group, index) => (
                   <TableRow key={`skeleton-${index}`}>
                     <TableCell className="font-bold font-body align-top">{group.label}</TableCell>
                     {phones.map(phone => (
                       <TableCell key={phone.id}>
                         <div className="flex flex-col gap-2">
                           {group.keys.map(key => (
                              <Skeleton key={key} className="h-4 w-full" />
                           ))}
                         </div>
                       </TableCell>
                     ))}
                   </TableRow>
                ))
              )}
              {!loading && specStructure.map((group, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-bold font-body align-top">{group.label}</TableCell>
                    {phones.map(phone => {
                      const isStandaloneWinner = !group.isCompact && phones.length > 1 && winners[group.keys[0]] === phone.model;
                      return (
                        <TableCell key={phone.id} className={`text-center transition-all text-xs ${isStandaloneWinner ? 'bg-accent/10' : ''}`}>
                          <div className="inline-block p-2 rounded-md w-full text-left">
                            <div className={`flex items-start justify-center gap-2 font-body text-base ${isStandaloneWinner ? 'bg-accent text-accent-foreground shadow-lg p-2 rounded-md' : ''}`}>
                              {isStandaloneWinner && <Trophy className="w-4 h-4 shrink-0 mt-1" />}
                              <div className='w-full'>
                                {group.keys.map(key => {
                                  const isBest = phones.length > 1 && phone.model === winners[key];
                                  return (
                                    <p key={key} className={`text-sm flex items-center justify-between gap-1 p-1 rounded-md transition-colors ${isBest ? 'bg-accent/20' : ''}`}>
                                      <span>
                                        {group.isCompact && <span className="font-semibold">{specLabels[key]}: </span>}
                                        {phone.specs[key]}
                                      </span>
                                      {isBest && <Trophy className="w-3 h-3 text-accent shrink-0" />}
                                    </p>
                                  );
                                })}
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
