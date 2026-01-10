'use server';

import { streamText } from 'genkit/ai';
import { productChatFlow } from '@/ai/flows/chat-flow';
import { AIStream, StreamingTextResponse } from 'ai';

export async function productChat(prompt: string) {
  const stream = await productChatFlow(prompt);

  const aiStream = AIStream(stream, {
    // Optional: You can modify the stream here if needed
  });

  return new StreamingTextResponse(aiStream);
}
