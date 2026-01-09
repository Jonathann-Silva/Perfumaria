'use server';

import { productChat } from '@/ai/flows/product-chat';

export async function productChatAction(history: any, prompt: string) {
  return await productChat({history, prompt});
}
