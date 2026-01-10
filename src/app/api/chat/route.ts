import { ai, model } from '@/ai/genkit';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const { stream } = await ai.generateStream({
      model: model,
      prompt: lastMessage,
      system: `Você é um especialista em perfumes e decantes da loja Perfumes & Decantes.`,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.text) {
            // Formato 0:"..." é o que o useChat do frontend espera
            controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk.text)}\n`));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream);
  } catch (error) {
    console.error("Erro crítico no servidor:", error);
    return new Response(JSON.stringify({ error: "Erro interno" }), { status: 500 });
  }
}