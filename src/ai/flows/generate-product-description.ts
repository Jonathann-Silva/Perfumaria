'use server';

/**
 * @fileOverview A product description generator AI agent.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the perfume product.'),
  brand: z.string().describe('The brand of the perfume.'),
  fragranceType: z.string().describe('The type of fragrance (e.g., Eau de Parfum, Eau de Toilette).'),
  keyNotes: z.string().describe('Key fragrance notes (e.g., Bergamot, Lavender, Vetiver).'),
  targetAudience: z.string().describe('The target audience for the perfume (e.g., modern man, sophisticated woman).'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('A detailed and engaging product description for the perfume.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging and informative product descriptions for perfumes.

  Based on the following information, generate a product description that captures the essence of the perfume and appeals to the target audience:

  Product Name: {{{productName}}}
  Brand: {{{brand}}}
  Fragrance Type: {{{fragranceType}}}
  Key Notes: {{{keyNotes}}}
  Target Audience: {{{targetAudience}}}

  The product description should be approximately 150-200 words long and highlight the unique characteristics of the perfume.
  `,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
