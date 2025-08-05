
'use server';
/**
 * @fileOverview Compares phone specifications using an AI model to determine the best in each category.
 *
 * - compareAllSpecs - A function that takes a list of phones and returns the best model for each spec.
 * - CompareSpecsInput - The input type for the compareAllSpecs function.
 * - CompareSpecsOutput - The return type for the compareAllSpecs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { specLabels } from '@/lib/types';
import type { Phone } from '@/lib/types';

// Dynamically create the output schema keys from specLabels
const winnerSchema = z.object(
  Object.fromEntries(
    Object.keys(specLabels).map(key => [key, z.string().optional().describe(`The model name of the phone that has the best spec for ${specLabels[key as keyof typeof specLabels]}. Null if no clear winner.`)])
  )
).describe('An object where each key is a spec ID and the value is the model name of the winning phone. If there is a tie or no clear winner, the value should be null.');
export type Winners = z.infer<typeof winnerSchema>;

const CompareSpecsInputSchema = z.object({
  phones: z.array(z.any()).describe('An array of phone objects to compare.'),
});
export type CompareSpecsInput = { phones: Phone[] };

export async function compareAllSpecs(input: CompareSpecsInput): Promise<Winners> {
  // Ensure we don't call the flow with no phones
  if (!input.phones || input.phones.length === 0) {
    return {};
  }
  return compareSpecsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareSpecsPrompt',
  input: {schema: CompareSpecsInputSchema},
  output: {schema: winnerSchema},
  prompt: `You are a world-renowned phone specifications analyst. You will be given a JSON array of phone objects.
  
Your task is to act as an expert and perform a comprehensive comparison to determine which phone is the best for each individual specification key.
Your analysis should be nuanced. For example:
- For 'price', lower is better.
- For numeric specs like 'displaySize' or 'batteryType' (capacity), higher is generally better.
- For complex, non-numeric specs like 'os', 'processorChipset', 'mainCameraModules', and 'selfieCameraModules', use your deep expert knowledge to determine the superior option. Don't just count megapixels or cores; consider the overall quality, performance, and user experience. For chipsets, analyze their architecture and real-world performance. For cameras, consider sensor quality, features, and video capabilities.
- For specs like 'osUpdate', parse the string (e.g., "7 years") to find the numeric value for comparison.

If there is a tie or if it's impossible to determine a clear winner for a specific spec, the value for that spec key should be null.

Here is the phone data:
{{{json phones}}}
`,
});

const compareSpecsFlow = ai.defineFlow(
  {
    name: 'compareSpecsFlow',
    inputSchema: CompareSpecsInputSchema,
    outputSchema: winnerSchema,
  },
  async (input) => {
    // The AI can't handle the 'id' field, so we remove it.
    const phonesToCompare = input.phones.map(({ id, ...rest }) => rest);
    const {output} = await prompt({ phones: phonesToCompare });
    return output!;
  }
);
