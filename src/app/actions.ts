'use server';

import { AIStream, StreamingTextResponse } from 'ai';
import { productChatFlow } from '@/ai/flows/chat-flow';

export async function productChat(prompt: string) {
  const stream = await productChatFlow(prompt);
  return new StreamingTextResponse(AIStream(stream));
}
