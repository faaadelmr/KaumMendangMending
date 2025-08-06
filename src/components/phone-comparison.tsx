
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
};

const specStructure: SpecGroup[] = [
    { label: specLabels.price, keys: ['price'] },
    { label: specLabels.announced, keys: ['announced'] },
    { label: "Display", keys: ['displaySize', 'displayResolution', 'displayProtection'] },
    { label: "Platform", keys: ['os', 'osUpdate', 'processorChipset', 'processorCpu', 'processorGpu'] },
    { label: specLabels.storageRam, keys: ['storageRam'] },
    { label: "Main Camera", keys: ['mainCameraModules', 'mainCameraFeatures', 'mainCameraVideo'] },
    { label: "Selfie Camera", keys: ['selfieCameraModules', 'selfieCameraFeatures', 'selfieCameraVideo'] },
    { label: "Comms", keys: ['nfc', 'ipRating', 'sim', 'usb'] },
    { label: specLabels.sensors, keys: ['sensors'] },
    { label: "Battery", keys: ['batteryType', 'batteryCharging'] },
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Spec Showdown</CardTitle>
          <CardDescription className="font-body">Komparasi antar spek, jika unggul maka akan ada tropi, namun jika sama maka hanya akan menampilkan sorotan pada text.</CardDescription>
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
                const isCompact = group.keys.length > 1;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-bold font-body align-top">{group.label}</TableCell>
                    {phones.map(phone => {
                       const winningSpecKey = isCompact ? null : group.keys[0];
                       const winnersForSpec = winningSpecKey ? winners[winningSpecKey] : [];
                       const isWinner = winningSpecKey ? winnersForSpec?.includes(phone.model) : false;
                       const isSoloWinner = isWinner && winnersForSpec?.length === 1;

                      return (
                        <TableCell key={phone.id} className={`text-center align-top transition-all text-xs ${isWinner ? 'bg-accent/10' : ''}`}>
                          <div className={`p-2 rounded-md w-full text-left ${isSoloWinner ? 'bg-accent text-accent-foreground shadow-lg' : ''}`}>
                            <div className={`flex items-start justify-center gap-2 font-body text-base`}>
                              {isSoloWinner && <Trophy className="w-4 h-4 shrink-0 mt-1" />}
                              <div className='w-full space-y-1'>
                                {group.keys.map(key => {
                                  const winnersForKey = winners[key] || [];
                                  const isBest = winnersForKey.includes(phone.model);
                                  const isSoloBest = isBest && winnersForKey.length === 1;

                                  return (
                                    <div key={key} className={`flex items-center justify-between gap-1 p-1 rounded-md transition-colors ${isBest ? 'bg-accent/20' : ''}`}>
                                      <span className="text-sm text-left">
                                        {isCompact && <span className="font-semibold">{specLabels[key]}: </span>}
                                        {phone.specs[key]}
                                      </span>
                                      {isSoloBest && <Trophy className="w-3 h-3 text-accent shrink-0" />}
                                    </div>
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
