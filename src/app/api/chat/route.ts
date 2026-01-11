'use server';

import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import type { Product } from '@/lib/types';

// Inicializar o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Função para buscar produtos do Firestore
async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Buscar os produtos do nosso banco de dados
    const products = await getProductsFromFirestore();

    // 2. Criar o contexto para a IA
    const productContext = products.map(p => 
      `- Nome: ${p.name}, Marca: ${p.brand}, Categoria: ${p.category}, Descrição: ${p.description || 'N/A'}, Preço: R$${p.price}`
    ).join('\n');

    // 3. Criar o prompt do sistema com as novas instruções
    const systemPrompt = `
      Você é um assistente virtual especialista em perfumes e decantes, trabalhando para a loja "Perfumes & Decantes".
      Sua principal tarefa é ajudar os clientes a encontrar produtos DENTRO DO NOSSO CATÁLOGO.

      **REGRAS CRÍTICAS:**
      1.  **NUNCA** sugira um perfume que não esteja na "LISTA DE PRODUTOS DISPONÍVEIS" abaixo.
      2.  Baseie TODAS as suas recomendações e descrições estritamente nas informações fornecidas na lista. Não adicione informações externas.
      3.  Se o usuário perguntar por um tipo de perfume (ex: "amadeirado"), procure na lista por produtos com categorias ou descrições que correspondam.
      4.  Se nenhum produto corresponder, informe educadamente que você não encontrou um produto com essas características em seu catálogo e sugira outras opções.
      5.  Formate suas respostas usando Markdown para facilitar a leitura (use listas, negrito, etc.).

      ---
      **LISTA DE PRODUTOS DISPONÍVEIS:**
      ${productContext}
      ---
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: systemPrompt
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
