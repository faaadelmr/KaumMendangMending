
'use server';
/**
 * @fileOverview Finds detailed laptop specifications using an AI model.
 *
 * - findLaptopSpecs - A function that takes a laptop name and returns its specifications.
 * - FindLaptopSpecsInput - The input type for the findLaptopSpecs function.
 * - FindLaptopSpecsOutput - The return type for the findLaptopSpecs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindLaptopSpecsInputSchema = z.object({
  query: z.string().describe('The name of the laptop to find specs for. Can be a general query like "latest Dell XPS 15".'),
  model: z.string().optional().describe('The AI model to use for the lookup.'),
});
export type FindLaptopSpecsInput = z.infer<typeof FindLaptopSpecsInputSchema>;

const FindLaptopSpecsOutputSchema = z.object({
  brand: z.string().describe("The brand name of the laptop, e.g., 'Dell', 'Apple'."),
  model: z.string().describe("The specific model name of the laptop, e.g., 'XPS 15 9530', 'Macbook Pro 16-inch M3'."),
  specs: z.object({
    price: z.string().describe("The approximate launch price in the Indonesian marketplace, formatted in IDR like 'Rp 25.000.000'."),
    releaseYear: z.string().describe("The year the laptop model was released."),
    color: z.string().describe("The available colors for the laptop, e.g., 'Silver, Space Gray'."),
    processor: z.string().describe("The full processor name, including generation and model, e.g., 'Intel Core Ultra 7 155H' or 'Apple M3 Pro'."),
    graphics: z.string().describe("The full graphics card name, including VRAM if available, e.g., 'NVIDIA GeForce RTX 4070 8GB' or 'Integrated Apple 18-core GPU'."),
    ram: z.string().describe("The amount and type of RAM, e.g., '16GB DDR5'."),
    storage: z.string().describe("The size and type of storage, e.g., '1TB NVMe SSD'."),
    displaySize: z.string().describe("The size of the display in inches, e.g., '15.6 inches'."),
    displayResolution: z.string().describe("The resolution of the display in pixels, e.g., '1920x1200'."),
    aspectRatio: z.string().describe("The aspect ratio of the display, e.g., '16:10'."),
    displayPanelType: z.string().describe("The panel technology of the display, e.g., 'OLED', 'IPS', 'Mini-LED'."),
    sRgbCoverage: z.string().describe("The sRGB coverage percentage of the display, e.g., '100% sRGB'."),
    displayBrightness: z.string().describe("The peak brightness of the display in nits, e.g., '500 nits'."),
    displayRefreshRate: z.string().describe("The refresh rate of the display in Hz, e.g., '120Hz'."),
    touchscreen: z.string().describe("Whether the display is a touchscreen, e.g., 'Yes' or 'No'."),
    weight: z.string().describe("The weight of the laptop in kg or grams, e.g., '1.8 kg'."),
    dimensions: z.string().describe("The dimensions of the laptop (Width x Height x Thickness) in mm, e.g., '344mm x 230mm x 18mm'."),
    ports: z.string().describe("A summary of the available ports, e.g., '2x Thunderbolt 4, 1x USB-A, HDMI 2.1, SD Card Reader'."),
    webcam: z.string().describe("The resolution of the webcam, e.g., '1080p'."),
    backlitKeyboard: z.string().describe("Whether the keyboard has a backlight, e.g., 'Yes' or 'No'."),
    fingerprintReader: z.string().describe("Whether the laptop has a fingerprint reader, e.g., 'Yes, integrated in power button' or 'No'."),
    material: z.string().describe("The primary material of the laptop's chassis, e.g., 'Aluminum', 'Magnesium Alloy', 'Polycarbonate'."),
    coolingSystem: z.string().describe("A brief description of the cooling system, e.g., 'Dual fans with vapor chamber' or 'Single fan with heat pipes'."),
    batteryCapacity: z.string().describe("The capacity of the battery in Watt-hours (Wh), e.g., '86Wh'."),
    batteryLife: z.string().describe("The manufacturer's estimated battery life for a standard task like web browsing, e.g., 'Up to 10 hours'."),
    geekbenchSingle: z.string().describe("The Geekbench 6 single-core score for the processor. Provide a score, e.g., '2800'."),
    geekbenchMulti: z.string().describe("The Geekbench 6 multi-core score for the processor. Provide a score, e.g., '14500'."),
    cinebenchSingle: z.string().describe("The Cinebench single-core score for the processor. Include the version, e.g., '1800 (R23)'."),
    cinebenchMulti: z.string().describe("The Cinebench multi-core score for the processor. Include the version, e.g., '18500 (R23)'."),
    pcMark10: z.string().describe("The PCMark 10 score for overall system performance. Provide just the number, e.g., '6500'."),
  }),
});
export type FindLaptopSpecsOutput = z.infer<typeof FindLaptopSpecsOutputSchema>;

export async function findLaptopSpecs(input: FindLaptopSpecsInput): Promise<FindLaptopSpecsOutput> {
  return findLaptopSpecsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findLaptopSpecsPrompt',
  input: {schema: FindLaptopSpecsInputSchema},
  output: {schema: FindLaptopSpecsOutputSchema},
  prompt: `You are a laptop technical expert. Find the full, detailed specifications for the following laptop: {{query}}.
  
  Provide detailed and accurate specifications for every single field. Be very specific. For example, for 'processor', don't just say 'Intel i7', say 'Intel Core i7-13700H'.
  For benchmark scores, provide just the number. For Cinebench, include the version used (e.g., R23). For dimensions, provide it as W x H x T.
  
  IMPORTANT: Find the price from the Indonesian marketplace and format it in Indonesian Rupiah (IDR), for example: "Rp 25.000.000".

  If the query is ambiguous (e.g., "latest Razer Blade"), use the most recent, popular model available from that lineup (e.g., the latest Razer Blade 15).
  `,
});

const findLaptopSpecsFlow = ai.defineFlow(
  {
    name: 'findLaptopSpecsFlow',
    inputSchema: FindLaptopSpecsInputSchema,
    outputSchema: FindLaptopSpecsOutputSchema,
  },
  async input => {
    const model = input.model ? `googleai/${input.model}` : undefined;
    const {output} = await prompt(
        { query: input.query },
        { model: model as any }
    );
    return output!;
  }
);

