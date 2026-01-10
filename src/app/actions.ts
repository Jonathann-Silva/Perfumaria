import { AIStream, StreamingTextResponse } from 'ai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function productChat(prompt: string) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
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
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch from Hugging Face API');
  }

  // Use AIStream to handle the response from Hugging Face
  const stream = AIStream(response);

  // Return a StreamingTextResponse to the client
  return new StreamingTextResponse(stream);
}
