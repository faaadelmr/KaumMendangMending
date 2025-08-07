
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

// Dynamically create the output schema keys from laptopSpecLabels, excluding benchmarks and color
const filteredSpecLabels = { ...laptopSpecLabels };
delete (filteredSpecLabels as any).color;
delete (filteredSpecLabels as any).geekbenchSingle;
delete (filteredSpecLabels as any).geekbenchMulti;
delete (filteredSpecLabels as any).cinebenchSingle;
delete (filteredSpecLabels as any).cinebenchMulti;
delete (filteredSpecLabels as any).pcMark10;


const winnerSchema = z.object(
  Object.fromEntries(
    Object.keys(filteredSpecLabels).map(key => [key, z.array(z.string()).describe(`An array of model names of the laptops that have the best spec for ${laptopSpecLabels[key as keyof typeof laptopSpecLabels]}. An empty array if no clear winner.`)])
  )
).describe('An object where each key is a spec ID and the value is an array of model names for the winning laptop(s). If there is a tie, include all tied models. If no clear winner, return an empty array.');
export type Winners = z.infer<typeof winnerSchema>;

const CompareLaptopSpecsInputSchema = z.object({
  laptops: z.array(z.any()).describe('An array of laptop objects to compare.'),
  model: z.string().optional().describe('The AI model to use for the comparison.'),
});
export type CompareLaptopSpecsInput = { laptops: Laptop[], model?: string };

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
  prompt: `You are a world-renowned and meticulous laptop technical analyst. You will be given a JSON object of laptops to compare, structured as "Laptop 1", "Laptop 2", etc. Each laptop object contains its 'model' name and its 'specs'.
  
Your task is to act as an expert and perform a comprehensive "VERSUS" comparison to determine which laptop is the best for **each individual specification key inside the 'specs' object, EXCLUDING 'color' and all benchmark scores (geekbench, cinebench, pcMark10)**. Your analysis must be nuanced and reflect deep technical knowledge. Follow these rules precisely:
- For 'price', the **lowest** value is the best.
- For 'releaseYear', the **highest** (newest) year is the best.
- For 'ram' (e.g., '16GB DDR5'), consider both capacity and type/speed. Higher capacity is better. For the same capacity, newer technology (DDR5 > DDR4) is better.
- For 'storage' (e.g., '1TB NVMe SSD'), consider both capacity and type. Higher capacity is better. For the same capacity, NVMe is better than a standard SSD.
- For 'displaySize', 'displayRefreshRate', 'batteryCapacity', 'batteryLife', 'sRgbCoverage', and 'displayBrightness' the **highest** numeric value is the best. These have been pre-parsed for you.
- For 'weight', the **lowest** value is the best. This has been pre-parsed for you.
- For 'processor' and 'graphics', this is critical. You MUST use your deep expert knowledge of computer hardware. Do not just look at clock speeds or VRAM. Analyze the architecture (e.g., Intel Core Ultra vs. Core i-series, Apple M-series generations, NVIDIA RTX 40-series vs 30-series), core counts, cache sizes, and your knowledge of real-world performance benchmarks to determine the superior component.
- For 'displayPanelType', OLED is generally superior to Mini-LED, which is better than IPS, which is better than VA/TN.
- For 'ports', more modern and versatile ports (like Thunderbolt 4/USB4) are better. Also consider the variety and number of ports.
- For 'aspectRatio' (e.g., "16:10" vs "16:9"), taller ratios like 16:10 or 3:2 are generally better for productivity.
- For 'coolingSystem', use your knowledge of thermal design. Systems with dual fans, vapor chambers, or more heat pipes are superior to basic single-fan systems.
- For 'touchscreen', 'backlitKeyboard', and 'fingerprintReader', 'Yes' is better than 'No'.

**CRITICAL OUTPUT RULE**: For each spec key (excluding the ones mentioned above), you must return an array containing the 'model' name of the winning laptop(s). 
- If one laptop is clearly the best, its model name should be the only item in the array.
- If multiple laptops tie for the best (e.g., same processor, same price, or identical specs), include all of their model names in the array.
- If it's impossible to determine a clear winner, or if the comparison is not applicable (e.g., all have the same value or data is missing), you **MUST** return an empty array for that specific spec key. Do not leave any key out of the final JSON output.

Here is the laptop data for the VERSUS comparison:
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
    // Helper function to extract the first number from a string
    const parseNumeric = (str: string | undefined): number | string => {
        if (typeof str !== 'string') return str || '';
        // Improved regex to handle various numeric formats, including versions in ()
        const cleanStr = str.split('(')[0];
        const match = cleanStr.match(/([\d.,]+)/);
        if (!match) return str;
        // Remove commas for thousands separators before parsing
        return parseFloat(match[0].replace(/,/g, ''));
    };

    // The AI can get confused by extra data. We will only send the model and the processed specs.
    const laptopsToCompare: Record<string, any> = {};
    input.laptops.forEach((laptop, index) => {
        // Make a mutable copy of specs to modify
        const processedSpecs: Record<string, any> = { ...laptop.specs };

        const numericKeys: (keyof typeof laptop.specs)[] = [
            'displaySize',
            'displayRefreshRate', 
            'batteryCapacity', 
            'batteryLife', 
            'weight',
            'sRgbCoverage',
            'displayBrightness',
            'geekbenchSingle',
            'geekbenchMulti',
            'cinebenchSingle',
            'cinebenchMulti',
            'pcMark10',
        ];

        for (const key of numericKeys) {
            processedSpecs[key] = parseNumeric(laptop.specs[key]);
        }

        // Remove color from specs for comparison
        delete (processedSpecs as any).color;
        
        laptopsToCompare[`Laptop ${index + 1}`] = { 
          model: laptop.model,
          specs: processedSpecs
        };
    });
    
    const model = input.model ? `googleai/${input.model}` : undefined;

    const {output} = await prompt(
        { laptops: laptopsToCompare }, 
        { model: model as any }
    );
    return output!;
  }
);
