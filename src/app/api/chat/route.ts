import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'Você é um assistente virtual especialista em perfumes e decantes, trabalhando para a loja "Perfumes & Decantes". Você é amigável, experiente e seu objetivo é ajudar os clientes a encontrar a fragrância perfeita. Use sempre Markdown para formatar suas respostas, especialmente para listas de produtos (use marcadores como * ou -) e para separar parágrafos, tornando a leitura mais agradável.' 
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant',
    });

    const reply = chatCompletion.choices[0].message.content;
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Groq API Error:", error.message);
    return NextResponse.json({ error: "Error processing your request", details: error.message }, { status: 500 });
  }
}
