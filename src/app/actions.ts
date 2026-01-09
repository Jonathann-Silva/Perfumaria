'use server';

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function productChat(prompt: string) {
    'use server';
    const huggingface = createOpenAI({
        baseURL: 'https://api-inference.huggingface.co/v1',
        apiKey: process.env.HUGGINGFACE_API_KEY,
    });

    const { textStream } = await streamText({
        model: huggingface('meta-llama/Meta-Llama-3-8B-Instruct'),
        prompt,
    });

    return textStream;
}
