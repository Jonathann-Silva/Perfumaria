'use server';

import { AIStream, StreamingTextResponse } from 'ai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function productChat(prompt: string) {
    const huggingFaceResponse = await fetch(
        'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 250,
                    return_full_text: false,
                },
            }),
        }
    );

    // Check for errors
    if (!huggingFaceResponse.ok) {
        throw new Error(
            `Hugging Face API request failed with status ${huggingFaceResponse.status}`
        );
    }
    
    // Convert the response into a ReadableStream
    const stream = AIStream(huggingFaceResponse);

    // Respond with the stream
    return new StreamingTextResponse(stream).textStream;
}
