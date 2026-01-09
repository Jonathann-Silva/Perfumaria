'use server';

import { productChat } from '@/ai/flows/product-chat';

export async function productChatAction(history: any, prompt: string) {
  const stream = await productChat({history, prompt});

  // Transform the stream to what the client expects
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return readableStream;
}
