'use server';

/**
 * @fileOverview Summarizes customer reviews for a given phone model.
 *
 * - summarizePhoneReviews - A function that takes a phone model and a list of reviews and returns a summary of the reviews.
 * - SummarizePhoneReviewsInput - The input type for the summarizePhoneReviews function.
 * - SummarizePhoneReviewsOutput - The return type for the summarizePhoneReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePhoneReviewsInputSchema = z.object({
  phoneModel: z.string().describe('The model of the phone to summarize reviews for.'),
  reviews: z.array(z.string()).describe('An array of customer reviews for the phone.'),
});
export type SummarizePhoneReviewsInput = z.infer<typeof SummarizePhoneReviewsInputSchema>;

const SummarizePhoneReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the customer reviews for the phone.'),
});
export type SummarizePhoneReviewsOutput = z.infer<typeof SummarizePhoneReviewsOutputSchema>;

export async function summarizePhoneReviews(input: SummarizePhoneReviewsInput): Promise<SummarizePhoneReviewsOutput> {
  return summarizePhoneReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePhoneReviewsPrompt',
  input: {schema: SummarizePhoneReviewsInputSchema},
  output: {schema: SummarizePhoneReviewsOutputSchema},
  prompt: `You are an expert product reviewer. Please summarize the following customer reviews for the {{phoneModel}} phone, highlighting common pros and cons:\n\n{%#each reviews %}{{{this}}}\n{%/each%}`,
});

const summarizePhoneReviewsFlow = ai.defineFlow(
  {
    name: 'summarizePhoneReviewsFlow',
    inputSchema: SummarizePhoneReviewsInputSchema,
    outputSchema: SummarizePhoneReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
