'use server';
/**
 * @fileOverview AI flow to suggest commonly required products and services for a quote based on the customer's vehicle profile.
 *
 * - suggestCommonPartsServices - A function that suggests products and services.
 * - SuggestCommonPartsServicesInput - The input type for the suggestCommonPartsServices function.
 * - SuggestCommonPartsServicesOutput - The return type for the suggestCommonPartsServices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCommonPartsServicesInputSchema = z.object({
  vehicleMake: z.string().describe('The make of the vehicle.'),
  vehicleModel: z.string().describe('The model of the vehicle.'),
  vehicleYear: z.number().describe('The year of the vehicle.'),
  customerName: z.string().describe('The name of the customer.'),
  recentServices: z.string().describe('The history of services performed on this vehicle.'),
});
export type SuggestCommonPartsServicesInput = z.infer<typeof SuggestCommonPartsServicesInputSchema>;

const SuggestCommonPartsServicesOutputSchema = z.object({
  suggestedParts: z.array(z.string()).describe('An array of commonly required parts for the vehicle.'),
  suggestedServices: z.array(z.string()).describe('An array of commonly required services for the vehicle.'),
});
export type SuggestCommonPartsServicesOutput = z.infer<typeof SuggestCommonPartsServicesOutputSchema>;

export async function suggestCommonPartsServices(input: SuggestCommonPartsServicesInput): Promise<SuggestCommonPartsServicesOutput> {
  return suggestCommonPartsServicesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCommonPartsServicesPrompt',
  input: {schema: SuggestCommonPartsServicesInputSchema},
  output: {schema: SuggestCommonPartsServicesOutputSchema},
  prompt: `You are an expert mechanic. Based on the customer's vehicle profile and service history, suggest commonly required parts and services for a quote.

Vehicle Make: {{{vehicleMake}}}
Vehicle Model: {{{vehicleModel}}}
Vehicle Year: {{{vehicleYear}}}
Customer Name: {{{customerName}}}
Recent Services: {{{recentServices}}}

Suggest parts and services that are relevant to the vehicle and the customer's needs. Return the suggested parts and services as arrays.
`,
});

const suggestCommonPartsServicesFlow = ai.defineFlow(
  {
    name: 'suggestCommonPartsServicesFlow',
    inputSchema: SuggestCommonPartsServicesInputSchema,
    outputSchema: SuggestCommonPartsServicesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
