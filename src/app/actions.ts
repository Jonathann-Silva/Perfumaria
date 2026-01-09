'use server';

export async function productChat(prompt: string) {
  const response = await fetch(
    'https://router.huggingface.co/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HF error ${response.status}: ${text}`);
  }

  const data = await response.json();

  return data.choices?.[0]?.message?.content;
}
