
'use server';
/**
 * @fileOverview Finds phone specifications using an AI model.
 *
 * - findPhoneSpecs - A function that takes a phone name and returns its specifications.
 * - FindPhoneSpecsInput - The input type for the findPhoneSpecs function.
 * - FindPhoneSpecsOutput - The return type for the findPhoneSpecs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindPhoneSpecsInputSchema = z.object({
  query: z.string().describe('The name of the phone to find specs for. Can be a general query like "latest iPhone".'),
});
export type FindPhoneSpecsInput = z.infer<typeof FindPhoneSpecsInputSchema>;

const FindPhoneSpecsOutputSchema = z.object({
  brand: z.string().describe("The brand name of the phone, e.g., 'Google', 'Apple'."),
  model: z.string().describe("The specific model name of the phone, e.g., 'Pixel 8 Pro', 'iPhone 15 Pro'."),
  specs: z.object({
    brand: z.string().describe("The brand name of the phone."),
    color: z.string().describe("The available colors for the phone."),
    announced: z.string().describe("The announcement date of the phone."),
    displaySize: z.string().describe("The size of the display in inches."),
    displayResolution: z.string().describe("The resolution of the display in pixels."),
    displayProtection: z.string().describe("The type of screen protection (e.g., 'Gorilla Glass Victus 2')."),
    os: z.string().describe("The operating system the phone runs on."),
    osUpdate: z.string().describe("The promised duration of OS updates."),
    processorChipset: z.string().describe("The chipset model."),
    processorCpu: z.string().describe("The CPU details."),
    processorGpu: z.string().describe("The GPU details."),
    storageRam: z.string().describe("The available storage and RAM configurations."),
    mainCameraModules: z.string().describe("The modules of the main camera."),
    mainCameraFeatures: z.string().describe("The features of the main camera."),
    mainCameraVideo: z.string().describe("The video recording capabilities of the main camera."),
    selfieCameraModules: z.string().describe("The modules of the selfie camera."),
    selfieCameraFeatures: z.string().describe("The features of the selfie camera."),
    selfieCameraVideo: z.string().describe("The video recording capabilities of the selfie camera."),
    nfc: z.string().describe("Whether NFC is supported."),
    ipRating: z.string().describe("The IP rating for dust and water resistance (e.g., 'IP68')."),
    sim: z.string().describe("The SIM card configuration (e.g., 'Nano-SIM, eSIM')."),
    usb: z.string().describe("The type of USB port."),
    sensors: z.string().describe("The sensors included in the phone."),
    batteryType: z.string().describe("The battery type and capacity (e.g., 'Li-Ion 5050 mAh')."),
    batteryCharging: z.string().describe("The charging specifications (wired, wireless, reverse wireless)."),
    price: z.string().describe("The approximate launch price in the Indonesian marketplace, formatted in IDR like 'Rp 15.000.000'."),
  }),
});
export type FindPhoneSpecsOutput = z.infer<typeof FindPhoneSpecsOutputSchema>;

export async function findPhoneSpecs(input: FindPhoneSpecsInput): Promise<FindPhoneSpecsOutput> {
  return findPhoneSpecsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findPhoneSpecsPrompt',
  input: {schema: FindPhoneSpecsInputSchema},
  output: {schema: FindPhoneSpecsOutputSchema},
  prompt: `You are a phone specifications expert. Find the full specifications for the following phone: {{query}}.
  
  Provide a realistic but brief summary of specs.
  
  IMPORTANT: Find the price from the Indonesian marketplace and format it in Indonesian Rupiah (IDR), for example: "Rp 15.000.000".

  If the query is ambiguous or the phone is not found (e.g., "latest samsung phone" or "galaxy s25 ultra"), use the closest available high-end model from that brand (e.g., the latest Galaxy S Ultra).
  
  Ensure you also provide the brand, color, IP rating, and SIM details.
  For the 'brand' field in 'specs', use the brand name of the phone.
  For 'color', list the available colors.
  For 'ipRating', provide the dust and water resistance rating.
  For 'sim', detail the SIM card setup.`,
});

const findPhoneSpecsFlow = ai.defineFlow(
  {
    name: 'findPhoneSpecsFlow',
    inputSchema: FindPhoneSpecsInputSchema,
    outputSchema: FindPhoneSpecsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
