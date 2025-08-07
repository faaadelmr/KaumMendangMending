
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  model: string;
}

type SpecGroup = {
    label: string;
    keys: (keyof LaptopSpec)[];
};

const specStructure: SpecGroup[] = [
    { label: "General", keys: ['price', 'releaseYear'] },
    { label: "Performance", keys: ['processor', 'graphics', 'ram', 'storage'] },
    { label: "Display", keys: ['displaySize', 'displayResolution', 'aspectRatio', 'displayPanelType', 'sRgbCoverage', 'displayBrightness', 'displayRefreshRate', 'touchscreen'] },
    { label: "Design & Portability", keys: ['weight', 'dimensions', 'material', 'ports', 'webcam', 'backlitKeyboard', 'fingerprintReader'] },
    { label: "Portability & Features", keys: ['batteryCapacity', 'batteryLife', 'coolingSystem'] },
    { label: "Benchmark", keys: ['geekbenchSingle', 'geekbenchMulti', 'cinebenchSingle', 'cinebenchMulti', 'pcMark10'] },
];


export default function LaptopComparison({ laptops, onRemoveLaptop, model }: LaptopComparisonProps) {
  const [winners, setWinners] = useState<Winners>({});
  const [loading, setLoading] = useState(false);

  const getWinners = useCallback(async () => {
    if (laptops.length < 2) {
      setWinners({});
      return;
    }
    setLoading(true);
    try {
      const result = await compareAllLaptopSpecs({ laptops, model });
      setWinners(result);
    } catch (error) {
      console.error("Failed to get AI comparison:", error);
      // Handle error appropriately, maybe show a toast
    } finally {
      setLoading(false);
    }
  }, [laptops, model]);

  useEffect(() => {
    getWinners();
  }, [getWinners]);

  const overallWinners = useMemo(() => {
    if (loading || Object.keys(winners).length === 0 || laptops.length < 2) {
      return [];
    }

    const trophyCounts = new Map<string, number>();
    laptops.forEach(l => trophyCounts.set(l.model, 0));

    for (const key in winners) {
      const winnersForKey = winners[key as keyof Winners] || [];
      if (winnersForKey.length === 1) {
        const winnerModel = winnersForKey[0];
        trophyCounts.set(winnerModel, (trophyCounts.get(winnerModel) || 0) + 1);
      }
    }

    let maxTrophies = 0;
    for (const count of trophyCounts.values()) {
      if (count > maxTrophies) {
        maxTrophies = count;
      }
    }

    if (maxTrophies === 0) return [];

    const champions: string[] = [];
    for (const [modelName, count] of trophyCounts.entries()) {
      if (count === maxTrophies) {
        champions.push(modelName);
      }
    }
    
    const allTiedWithZero = champions.length === laptops.length && maxTrophies === 0
    return allTiedWithZero ? [] : champions;
  }, [winners, loading, laptops]);

  const renderSkeleton = () => (
    specStructure.map((group, groupIndex) => (
      <React.Fragment key={`skeleton-group-${groupIndex}`}>
        <TableRow>
          <TableCell colSpan={laptops.length + 1} className="font-bold font-body text-lg p-2 bg-muted/50">{group.label}</TableCell>
        </TableRow>
        {group.keys.map(key => (
          <TableRow key={`skeleton-row-${key}`}>
            <TableCell className="font-bold font-body">{laptopSpecLabels[key]}</TableCell>
            {laptops.map((laptop) => (
              <TableCell key={laptop.id} className="text-center">
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </React.Fragment>
    ))
  );

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
                      <div className="flex items-center justify-center gap-1">
                        {overallWinners.includes(laptop.model) && <Trophy className="size-6 text-amber-400" />}
                        <span className="font-bold">{laptop.model}</span>
                        <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0" onClick={() => onRemoveLaptop(laptop.id)}>
                          <X className="size-4"/>
                        </Button>
                      </div>
                      <div className="text-sm font-body text-muted-foreground text-center">
                        <p>{laptop.brand}</p>
                        <p>{laptop.specs.color}</p>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && laptops.length > 1 ? renderSkeleton() : specStructure.map((group) => (
                <React.Fragment key={group.label}>
                  <TableRow>
                    <TableCell colSpan={laptops.length + 1} className="font-bold font-body text-lg p-2 bg-muted/50">{group.label}</TableCell>
                  </TableRow>
                  {group.keys.map(key => {
                      const winnersForKey = winners[key] || [];
                      const isWinnerDeclared = winnersForKey.length > 0;
                      const isSoloWinner = isWinnerDeclared && winnersForKey.length === 1;

                      const hasValue = laptops.some(l => l.specs[key]);
                      if (!hasValue) return null;

                      return (
                          <TableRow key={key}>
                              <TableCell className="font-bold font-body align-middle">{laptopSpecLabels[key]}</TableCell>
                              {laptops.map(laptop => {
                                  const isBest = winnersForKey.includes(laptop.model);
                                  
                                  return (
                                      <TableCell key={laptop.id} className={`text-center align-middle transition-all ${isBest ? 'bg-accent/10' : ''}`}>
                                          <div className={`p-2 rounded-md w-full h-full flex items-center justify-center gap-2 ${isSoloWinner && isBest ? 'bg-accent text-accent-foreground shadow-lg' : ''}`}>
                                              {isSoloWinner && isBest && <Trophy className="w-4 h-4 shrink-0" />}
                                              <span className="text-sm">{laptop.specs[key]}</span>
                                          </div>
                                      </TableCell>
                                  );
                              })}
                          </TableRow>
                      );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
