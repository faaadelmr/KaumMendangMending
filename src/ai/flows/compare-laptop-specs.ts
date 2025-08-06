
'use server';
/**
 * @fileOverview Compares laptop specifications using an AI model to determine the best in each category.
 *
 * - compareAllLaptopSpecs - A function that takes a list of laptops and returns the best model for each spec.
 * - CompareLaptopSpecsInput - The input type for the compareAllLaptopSpecs function.
 * - CompareLaptopSpecsOutput - The return type for the compareAllLaptopSpecs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { laptopSpecLabels } from '@/lib/types';
import type { Laptop } from '@/lib/types';

// Dynamically create the output schema keys from laptopSpecLabels
const winnerSchema = z.object(
  Object.fromEntries(
    Object.keys(laptopSpecLabels).map(key => [key, z.array(z.string()).describe(`An array of model names of the laptops that have the best spec for ${laptopSpecLabels[key as keyof typeof laptopSpecLabels]}. An empty array if no clear winner.`)])
  )
).describe('An object where each key is a spec ID and the value is an array of model names for the winning laptop(s). If there is a tie, include all tied models. If no clear winner, return an empty array.');
export type Winners = z.infer<typeof winnerSchema>;

const CompareLaptopSpecsInputSchema = z.object({
  laptops: z.array(z.any()).describe('An array of laptop objects to compare.'),
});
export type CompareLaptopSpecsInput = { laptops: Laptop[] };

export async function compareAllLaptopSpecs(input: CompareLaptopSpecsInput): Promise<Winners> {
  // Ensure we don't call the flow with no laptops
  if (!input.laptops || input.laptops.length === 0) {
    return {};
  }
  return compareLaptopSpecsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareLaptopSpecsPrompt',
  input: {schema: CompareLaptopSpecsInputSchema},
  output: {schema: winnerSchema},
  prompt: `You are a world-renowned laptop technical analyst. You will be given a JSON array of laptop objects.
  
Your task is to act as an expert and perform a comprehensive comparison to determine which laptop is the best for **each individual specification key**. Your analysis must be nuanced and reflect deep technical knowledge. For example:
- For 'price', lower is better.
- For 'releaseYear', newer is better.
- For numeric specs like 'ram' (capacity), 'storage' (capacity), 'displayRefreshRate', 'batteryCapacity', or 'batteryLife', higher is generally better.
- For 'weight', lower is better.
- For complex, non-numeric specs like 'processor' and 'graphics', you MUST use your deep expert knowledge of computer hardware. Do not just look at clock speeds. Analyze the architecture, core counts, and real-world performance benchmarks (like Cinebench for CPUs, 3DMark for GPUs) to determine the superior component.
- For 'displayPanelType', OLED is generally superior to IPS, which is better than VA/TN.
- For 'ports', more modern and versatile ports (like Thunderbolt 4) are better.

**IMPORTANT**: For each spec, you must return an array containing the 'model' name of the winning laptop(s). 
- If one laptop is clearly the best, its model name should be the only item in the array.
- If multiple laptops tie for the best (e.g., same processor, or same price), include all of their model names in the array.
- If it's impossible to determine a clear winner, or if the comparison is not applicable, you **MUST** return an empty array for that spec key. Do not leave any key out.

Here is the laptop data:
{{{json laptops}}}
`,
});

const compareLaptopSpecsFlow = ai.defineFlow(
  {
    name: 'compareLaptopSpecsFlow',
    inputSchema: CompareLaptopSpecsInputSchema,
    outputSchema: winnerSchema,
  },
  async (input) => {
    // The AI can't handle the 'id' field, so we remove it.
    const laptopsToCompare = input.laptops.map(({ id, ...rest }) => rest);
    const {output} = await prompt({ laptops: laptopsToCompare });
    return output!;
  }
);
