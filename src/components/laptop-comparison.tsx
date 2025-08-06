
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Laptop, LaptopSpec } from '@/lib/types';
import { laptopSpecLabels } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, X } from 'lucide-react';
import { Button } from './ui/button';
import { compareAllLaptopSpecs, type Winners } from '@/ai/flows/compare-laptop-specs';
import { Skeleton } from '@/components/ui/skeleton';


interface LaptopComparisonProps {
  laptops: Laptop[];
  onRemoveLaptop: (laptopId: number) => void;
}

type SpecGroup = {
    label: string;
    keys: (keyof LaptopSpec)[];
};

const specStructure: SpecGroup[] = [
    { label: "General", keys: ['price', 'releaseYear', 'color'] },
    { label: "Performance", keys: ['processor', 'graphics', 'ram', 'storage'] },
    { label: "Display", keys: ['displaySize', 'displayResolution', 'aspectRatio', 'displayPanelType', 'sRgbCoverage', 'displayBrightness', 'displayRefreshRate', 'touchscreen'] },
    { label: "Design & Portability", keys: ['weight', 'dimensions', 'material', 'ports', 'webcam', 'backlitKeyboard', 'fingerprintReader'] },
    { label: "Portability & Features", keys: ['batteryCapacity', 'batteryLife', 'coolingSystem'] },
    { label: "Benchmark", keys: ['geekbenchSingle', 'geekbenchMulti'] },
];


export default function LaptopComparison({ laptops, onRemoveLaptop }: LaptopComparisonProps) {
  const [winners, setWinners] = useState<Winners>({});
  const [loading, setLoading] = useState(false);

  const getWinners = useCallback(async () => {
    if (laptops.length < 2) {
      setWinners({});
      return;
    }
    setLoading(true);
    try {
      const result = await compareAllLaptopSpecs({ laptops });
      setWinners(result);
    } catch (error) {
      console.error("Failed to get AI comparison:", error);
      // Handle error appropriately, maybe show a toast
    } finally {
      setLoading(false);
    }
  }, [laptops]);

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
                {laptops.map(laptop => (
                  <TableHead key={laptop.id} className="text-center font-headline text-lg text-primary-foreground/90 relative group align-bottom">
                    <div className="flex flex-col items-center justify-end gap-1 min-h-[80px]">
                      <div className="flex items-start gap-1">
                        <span className="font-bold">{laptop.model}</span>
                        <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemoveLaptop(laptop.id)}>
                          <X className="size-4"/>
                        </Button>
                      </div>
                      <div className="text-sm font-body text-muted-foreground">
                        <p>{laptop.brand}</p>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && laptops.length > 1 && (
                specStructure.map((group, index) => (
                   <TableRow key={`skeleton-${index}`}>
                     <TableCell className="font-bold font-body align-top">{group.label}</TableCell>
                     {laptops.map(laptop => (
                       <TableCell key={laptop.id}>
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
                    {laptops.map(laptop => {
                       const winningSpecKey = isCompact ? null : group.keys[0];
                       const winnersForSpec = winningSpecKey ? winners[winningSpecKey] : [];
                       const isWinner = winningSpecKey ? winnersForSpec?.includes(laptop.model) : false;
                       const isSoloWinner = isWinner && winnersForSpec?.length === 1;

                      return (
                        <TableCell key={laptop.id} className={`text-center align-top transition-all text-xs ${isWinner ? 'bg-accent/10' : ''}`}>
                          <div className={`p-2 rounded-md w-full text-left ${isSoloWinner ? 'bg-accent text-accent-foreground shadow-lg' : ''}`}>
                            <div className={`flex items-start justify-center gap-2 font-body text-base`}>
                              {isSoloWinner && <Trophy className="w-4 h-4 shrink-0 mt-1" />}
                              <div className='w-full space-y-1'>
                                {group.keys.map(key => {
                                  const winnersForKey = winners[key] || [];
                                  const isBest = winnersForKey.includes(laptop.model);
                                  const isSoloBest = isBest && winnersForKey.length === 1;

                                  return (
                                    <div key={key} className={`flex items-center justify-between gap-1 p-1 rounded-md transition-colors ${isBest ? 'bg-accent/20' : ''}`}>
                                      <span className="text-sm text-left">
                                        {isCompact && <span className="font-semibold">{laptopSpecLabels[key]}: </span>}
                                        {laptop.specs[key]}
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
