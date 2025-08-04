"use client";

import { useState, useEffect } from 'react';
import { summarizePhoneReviews } from '@/ai/flows/summarize-phone-reviews';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ReviewSummaryProps {
  phoneModel: string;
  reviews: string[];
}

export default function ReviewSummary({ phoneModel, reviews }: ReviewSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Prevent re-fetching summary on every render
    let isMounted = true;
    
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await summarizePhoneReviews({ phoneModel, reviews });
        if (isMounted) {
          setSummary(result.summary);
        }
      } catch (e) {
        if (isMounted) {
          const errorMessage = 'Could not generate summary. Please try again later.';
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "AI Error",
            description: `Failed to get review summary for ${phoneModel}.`,
          });
          console.error(e);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSummary();
    
    return () => {
      isMounted = false;
    }
  }, [phoneModel, reviews, toast]);

  if (loading) {
    return (
      <div className="space-y-3 p-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <p className="text-sm text-card-foreground/80 font-body leading-relaxed whitespace-pre-wrap">
      {summary}
    </p>
  );
}
