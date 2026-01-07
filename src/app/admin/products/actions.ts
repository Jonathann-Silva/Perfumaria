'use server';

import {
  generateProductDescription,
  type GenerateProductDescriptionOutput,
  type GenerateProductDescriptionInput,
} from '@/ai/flows/generate-product-description';

export async function generateDescriptionAction(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  try {
    const result = await generateProductDescription(input);
    return result;
  } catch (error) {
    console.error('Error generating product description:', error);
    return { productDescription: 'Failed to generate description.' };
  }
}
