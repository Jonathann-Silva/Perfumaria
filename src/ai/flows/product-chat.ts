'use server';

/**
 * @fileoverview A conversational AI agent that can answer questions about products.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {getProductInfo} from '../tools/product-knowledge-base';

const ProductChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string(),
    })),
  })),
  prompt: z.string(),
});

export async function productChat(input: z.infer<typeof ProductChatInputSchema>) {
  const prompt = `You are an expert perfume assistant for an online store called "Perfumes & Decantes". Your goal is to help customers find the perfect fragrance based on their needs.

      - Use the provided tool to get information about the products.
      - NEVER make up product information. If the tool returns no information, say that you couldn't find what they are looking for.
      - Keep your answers concise and helpful.
      - The user is conversing with you through a chat interface.
      - The current date is ${new Date().toLocaleDateString()}.
      
      User question: ${input.prompt}`;

  const { stream } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    tools: [getProductInfo],
    prompt: prompt,
    history: input.history,
    stream: true,
  });

  return { stream };
}
