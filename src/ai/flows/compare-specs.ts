
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
    Object.keys(specLabels).map(key => [key, z.array(z.string()).describe(`An array of model names of the phones that have the best spec for ${specLabels[key as keyof typeof specLabels]}. An empty array if no clear winner.`)])
  )
).describe('An object where each key is a spec ID and the value is an array of model names for the winning phone(s). If there is a tie, include all tied models. If no clear winner, return an empty array.');
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
  
Your task is to act as an expert and perform a comprehensive comparison to determine which phone is the best for **each individual specification key**. Your analysis must be nuanced. For example:
- For 'price', lower is better.
- For numeric specs like 'displaySize' or 'batteryType' (capacity), higher is generally better.
- For complex, non-numeric specs like 'os', 'processorChipset', 'mainCameraModules', and 'selfieCameraModules', use your deep expert knowledge to determine the superior option. Don't just count megapixels or cores; consider the overall quality, performance, and user experience. For chipsets, analyze their architecture and real-world performance. For cameras, consider sensor quality, features, and video capabilities.
- For specs like 'osUpdate', parse the string (e.g., "7 years") to find the numeric value for comparison.

**IMPORTANT**: For each spec, you must return an array containing the 'model' name of the winning phone(s). 
- If one phone is clearly the best, its model name should be the only item in the array.
- If multiple phones tie for the best, include all of their model names in the array.
- If it's impossible to determine a clear winner, or if the comparison is not applicable, you **MUST** return an empty array for that spec key. Do not leave any key out.

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
