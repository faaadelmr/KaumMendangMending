
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

// Dynamically create the output schema keys from specLabels, excluding brand, color, and benchmarks
const filteredSpecLabels = { ...specLabels };
delete (filteredSpecLabels as any).brand;
delete (filteredSpecLabels as any).color;
delete (filteredSpecLabels as any).geekbenchSingle;
delete (filteredSpecLabels as any).geekbenchMulti;
delete (filteredSpecLabels as any).antutu;
delete (filteredSpecLabels as any).threeDMark;


const winnerSchema = z.object(
  Object.fromEntries(
    Object.keys(filteredSpecLabels).map(key => [key, z.array(z.string()).describe(`An array of model names of the phones that have the best spec for ${specLabels[key as keyof typeof specLabels]}. An empty array if no clear winner.`)])
  )
).describe('An object where each key is a spec ID and the value is an array of model names for the winning phone(s). If there is a tie, include all tied models. If no clear winner, return an empty array.');
export type Winners = z.infer<typeof winnerSchema>;

const CompareSpecsInputSchema = z.object({
  phones: z.array(z.any()).describe('An array of phone objects to compare.'),
  model: z.string().optional().describe('The AI model to use for the comparison.'),
});
export type CompareSpecsInput = { phones: Phone[], model?: string };

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
  prompt: `You are a world-renowned and meticulous phone technical analyst. You will be given a JSON object of phones to compare, structured as "Phone 1", "Phone 2", etc. Each phone object contains its 'model' name and its 'specs'.
  
Your task is to act as an expert and perform a comprehensive "VERSUS" comparison to determine which phone is the best for **each individual specification key inside the 'specs' object, EXCLUDING 'brand', 'color', and all benchmark scores (geekbench, antutu, threeDMark)**. Your analysis must be nuanced and reflect deep technical knowledge. Follow these rules precisely:
- For 'price', the **lowest** value is the best.
- For 'displayRefreshRate' and 'displayBrightness', parse the numeric value (e.g., '120Hz' -> 120, '1800 nits' -> 1800) and the **highest** value is the best.
- For 'displayType', use your knowledge of screen technology. OLED/AMOLED variants are generally superior to IPS/LCD.
- For 'network', newer technology is better (5G > 4G > 3G).
- For numeric specs like 'displaySize', 'batteryType' (capacity), higher is generally better.
- For complex, non-numeric specs like 'os', 'processorChipset', 'mainCameraModules', and 'selfieCameraModules', use your deep expert knowledge to determine the superior option. Don't just count megapixels or cores; consider the overall quality, performance, and user experience. For chipsets, analyze their architecture and real-world performance. For cameras, consider sensor quality, features, and video capabilities.
- For specs like 'osUpdate', parse the string (e.g., "7 years") to find the numeric value for comparison. Higher is better.
- For storage and RAM types (e.g. UFS 4.0 vs 3.1), newer/faster is better.

**CRITICAL OUTPUT RULE**: For each spec key (excluding brand, color, and benchmarks), you must return an array containing the 'model' name of the winning phone(s). 
- If one phone is clearly the best, its model name should be the only item in the array.
- If multiple phones tie for the best (e.g., same processor, same price, or identical specs), include all of their model names in the array.
- If it's impossible to determine a clear winner, or if the comparison is not applicable (e.g., all have the same value or data is missing), you **MUST** return an empty array for that specific spec key. Do not leave any key out of the final JSON output.

Here is the phone data for the VERSUS comparison:
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
    // The AI can get confused by extra data. We will only send the model and the specs.
    const phonesToCompare: Record<string, any> = {};
    input.phones.forEach((phone, index) => {
        // Create a copy and remove brand/color from specs for comparison
        const specsForComparison = { ...phone.specs };
        delete (specsForComparison as any).brand;
        delete (specsForComparison as any).color;
        
        phonesToCompare[`Phone ${index + 1}`] = { 
          model: phone.model,
          specs: specsForComparison,
        };
    });
    
    const model = input.model ? `googleai/${input.model}` : undefined;

    const {output} = await prompt(
        { phones: phonesToCompare }, 
        { model: model as any }
    );
    return output!;
  }
);
