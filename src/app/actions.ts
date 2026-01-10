'use server';

import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { HfInference } from '@huggingface/inference';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function productChat(prompt: string) {
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

  const stream = hf.textGenerationStream({
    model: 'HuggingFaceH4/zephyr-7b-beta',
    inputs: `<s><|system|>
You are a friendly and helpful perfume assistant for an online store called "Perfumes & Decantes". Your goal is to help customers find the perfect scent. Be concise and conversational.
Use the following product information to answer questions:
- Sauvage Elixir by Dior: Aromatic, with lavender, spices, and a woody base.
- Black Orchid by Tom Ford: A dark, floral, and spicy scent with truffle and patchouli.
- Libre by YSL: A bold floral with lavender, orange blossom, and musk.
- Aventus by Creed: A powerful fruity and woody scent with pineapple, birch, and musk.
</s>
<|user|>
${prompt}</s>
<|assistant|>
`,
    parameters: {
      max_new_tokens: 400,
      temperature: 0.7,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  const textStream = HuggingFaceStream(stream);

  return new StreamingTextResponse(textStream);
}
