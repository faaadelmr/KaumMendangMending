
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
});
export type FindLaptopSpecsInput = z.infer<typeof FindLaptopSpecsInputSchema>;

const FindLaptopSpecsOutputSchema = z.object({
  brand: z.string().describe("The brand name of the laptop, e.g., 'Dell', 'Apple'."),
  model: z.string().describe("The specific model name of the laptop, e.g., 'XPS 15 9530', 'Macbook Pro 16-inch M3'."),
  specs: z.object({
    price: z.string().describe("The approximate launch price in the Indonesian marketplace, formatted in IDR like 'Rp 25.000.000'."),
    releaseYear: z.string().describe("The year the laptop model was released."),
    processor: z.string().describe("The full processor name, including generation and model, e.g., 'Intel Core Ultra 7 155H' or 'Apple M3 Pro'."),
    graphics: z.string().describe("The full graphics card name, including VRAM if available, e.g., 'NVIDIA GeForce RTX 4070 8GB' or 'Integrated Apple 18-core GPU'."),
    ram: z.string().describe("The amount and type of RAM, e.g., '16GB DDR5'."),
    storage: z.string().describe("The size and type of storage, e.g., '1TB NVMe SSD'."),
    displaySize: z.string().describe("The size of the display in inches, e.g., '15.6 inches'."),
    displayResolution: z.string().describe("The resolution of the display in pixels, e.g., '1920x1200'."),
    displayPanelType: z.string().describe("The panel technology of the display, e.g., 'OLED', 'IPS', 'Mini-LED'."),
    displayRefreshRate: z.string().describe("The refresh rate of the display in Hz, e.g., '120Hz'."),
    weight: z.string().describe("The weight of the laptop in kg or grams, e.g., '1.8 kg'."),
    ports: z.string().describe("A summary of the available ports, e.g., '2x Thunderbolt 4, 1x USB-A, HDMI 2.1, SD Card Reader'."),
    webcam: z.string().describe("The resolution of the webcam, e.g., '1080p'."),
    batteryCapacity: z.string().describe("The capacity of the battery in Watt-hours (Wh), e.g., '86Wh'."),
    batteryLife: z.string().describe("The manufacturer's estimated battery life for a standard task like web browsing, e.g., 'Up to 10 hours'."),
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
    const {output} = await prompt(input);
    return output!;
  }
);
