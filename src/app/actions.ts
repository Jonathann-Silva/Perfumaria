'use server';

export async function productChat(prompt: string) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HF error ${response.status}: ${text}`);
  }

  const data = await response.json();

  // resposta padrão desses modelos
  return data[0]?.generated_text ?? data;
}
