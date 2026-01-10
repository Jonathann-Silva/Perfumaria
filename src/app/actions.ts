'use server';

import { AIStream, StreamingTextResponse } from 'ai';

// IMPORTANT! The runtime must be defined in the page that uses this action.
// We are removing it from here to solve a build error.

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
        inputs: prompt,
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
