
'use server';
/**
 * @fileOverview Finds phone specifications using an AI model.
 *
 * - findPhoneSpecs - A function that takes a phone name and returns its specifications.
 * - FindPhoneSpecsInput - The input type for the findPhoneSpecs function.
 * - FindPhoneSpecsOutput - The return type for the findPhonespecs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindPhoneSpecsInputSchema = z.object({
  query: z.string().describe('The name of the phone to find specs for. Can be a general query like "latest iPhone".'),
  model: z.string().optional().describe('The AI model to use for the lookup.'),
});
export type FindPhoneSpecsInput = z.infer<typeof FindPhoneSpecsInputSchema>;

const FindPhoneSpecsOutputSchema = z.object({
  brand: z.string().describe("The brand name of the phone, e.g., 'Google', 'Apple'."),
  model: z.string().describe("The specific model name of the phone, e.g., 'Pixel 8 Pro', 'iPhone 15 Pro'."),
  specs: z.object({
    brand: z.string().describe("The brand name of the phone."),
    color: z.string().describe("The available colors for the phone."),
    announced: z.string().describe("The announcement date of the phone."),
    dimensions: z.string().describe("The dimensions of the phone (W x H x T) in mm."),
    displaySize: z.string().describe("The size of the display in inches."),
    displayResolution: z.string().describe("The resolution of the display in pixels."),
    displayProtection: z.string().describe("The type of screen protection (e.g., 'Gorilla Glass Victus 2')."),
    displayType: z.string().describe("The panel technology of the display, e.g., 'AMOLED', 'IPS LCD'."),
    displayRefreshRate: z.string().describe("The refresh rate of the display in Hz, e.g., '120Hz'."),
    displayBrightness: z.string().describe("The peak brightness of the display in nits, e.g., '1800 nits'."),
    os: z.string().describe("The operating system the phone runs on."),
    osUpdate: z.string().describe("The promised duration of OS updates in years (e.g., '7 years')."),
    processorChipset: z.string().describe("The chipset model. Be very specific, e.g., 'Unisoc T606', not just 'Unisoc'"),
    processorCpu: z.string().describe("The CPU details."),
    processorGpu: z.string().describe("The GPU details."),
    storageRam: z.string().describe("The available storage and RAM configurations."),
    storageType: z.string().describe("The type of internal storage, e.g., 'UFS 3.1'."),
    ramType: z.string().describe("The type of RAM, e.g., 'LPDDR5'."),
    mainCameraModules: z.string().describe("The modules of the main camera."),
    mainCameraFeatures: z.string().describe("The features of the main camera."),
    mainCameraVideo: z.string().describe("The video recording capabilities of the main camera."),
    selfieCameraModules: z.string().describe("The modules of the selfie camera."),
    selfieCameraFeatures: z.string().describe("The features of the selfie camera."),
    selfieCameraVideo: z.string().describe("The video recording capabilities of the selfie camera."),
    network: z.string().describe("The network technology, e.g., 'GSM / HSPA / LTE / 5G'."),
    nfc: z.string().describe("Whether NFC is supported."),
    ipRating: z.string().describe("The IP rating for dust and water resistance (e.g., 'IP68')."),
    sim: z.string().describe("The SIM card configuration (e.g., 'Nano-SIM, eSIM')."),
    usb: z.string().describe("The type of USB port."),
    bluetooth: z.string().describe("The Bluetooth version, e.g., '5.3'."),
    sensors: z.string().describe("The sensors included in the phone."),
    batteryType: z.string().describe("The battery type and capacity in mAh (e.g., 'Li-Ion 5050 mAh')."),
    batteryCharging: z.string().describe("The charging specifications (wired, wireless, reverse wireless)."),
    price: z.string().describe("The approximate launch price in the Indonesian marketplace, formatted in IDR like 'Rp 15.000.000'."),
    geekbenchSingle: z.string().describe("The Geekbench 6 single-core score. Provide just the number."),
    geekbenchMulti: z.string().describe("The Geekbench 6 multi-core score. Provide just the number."),
    antutu: z.string().describe("The AnTuTu benchmark score, including the version used, e.g., '1,500,000 (v10)'."),
    threeDMark: z.string().describe("The 3DMark Wild Life benchmark score. Provide just the number."),
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
  
  Provide detailed and accurate specifications for every single field. Be very specific. For example, for 'processorChipset', don't just say 'Unisoc', say 'Unisoc T606'. For benchmarks, provide just the number, except for Antutu where you should also mention the version.
  
  IMPORTANT: Find the price from the Indonesian marketplace and format it in Indonesian Rupiah (IDR), for example: "Rp 15.000.000".

  If the query is a specific model name (e.g., "Nubia A36", "Itel A90"), you MUST find that exact model. Do NOT substitute it for another model.
  If the query is ambiguous (e.g., "latest samsung phone" or "newest pixel"), then you can use the most recent, popular, high-end model available from that brand (e.g., the latest Galaxy S Ultra).
  
  Ensure you provide specific details for the following:
  - 'displayType': The specific panel technology, e.g., 'Super Retina XDR OLED', 'Dynamic LTPO AMOLED 2X'.
  - 'displayRefreshRate': The display refresh rate in Hz.
  - 'displayBrightness': The peak brightness in nits.
  - 'osUpdate': The promised duration of OS updates, formatted like '7 years'.
  - 'batteryType': The capacity in mAh, formatted like 'Li-Ion 5050 mAh'.
  - 'brand': The brand name of the phone.
  - 'color': The available colors.
  - 'network': The network technology (e.g., "5G").
  - 'ipRating': The dust and water resistance rating.
  - 'sim': The SIM card setup.
  - 'dimensions': The phone's dimensions as W x H x T in mm.
  - 'bluetooth': The bluetooth version.
  - 'storageType': The type of storage, e.g. UFS 4.0.
  - 'ramType': The type of RAM, e.g. LPDDR5X.
  - 'geekbenchSingle': The Geekbench 6 single-core score.
  - 'geekbenchMulti': The Geekbench 6 multi-core score.
  - 'antutu': The AnTuTu score and version, e.g. "1.500.000 (v10)".
  - 'threeDMark': The 3DMark Wild Life score.`,
});

const findPhoneSpecsFlow = ai.defineFlow(
  {
    name: 'findPhoneSpecsFlow',
    inputSchema: FindPhoneSpecsInputSchema,
    outputSchema: FindPhoneSpecsOutputSchema,
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
