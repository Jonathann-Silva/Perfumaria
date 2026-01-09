'use server';

import { productChat } from '@/ai/flows/product-chat';
import { type Message } from '@/components/chat/product-chat-assistant';

export async function productChatAction(history: Message[], prompt: string) {
  const { stream } = await productChat({
    history: history.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    })),
    prompt,
  });

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
