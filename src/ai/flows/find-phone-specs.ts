
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
  image: z.string().describe("A placeholder image URL for the phone, in the format 'https://placehold.co/400x400.png'."),
  specs: z.object({
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
    usb: z.string().describe("The type of USB port."),
    sensors: z.string().describe("The sensors included in the phone."),
    batteryType: z.string().describe("The battery type and capacity (e.g., 'Li-Ion 5050 mAh')."),
    batteryCharging: z.string().describe("The charging specifications (wired, wireless, reverse wireless)."),
    price: z.string().describe("The approximate launch price in USD, formatted like '$999'."),
  }),
  reviews: z.array(z.string()).describe("An array of 5 diverse, one-sentence customer review highlights, covering both pros and cons. These should be realistic but generated."),
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
  
  If the query is ambiguous (e.g., "latest samsung phone"), use the latest high-end model from that brand (e.g., the latest Galaxy S Ultra).
  
  Always provide a placeholder image from placehold.co.
  
  Generate 5 realistic, one-sentence review highlights.`,
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
