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

    // 2. Criar o contexto para a IA, incluindo estoque e tipo.
    const productContext = products.map(p => {
        const typeInfo = p.type === 'decant' ? `Decante ${p.decantMl || '?'}ml` : 'Frasco Lacrado';
        return `- Nome: ${p.name}, Marca: ${p.brand}, Categoria: ${p.category}, Tipo: ${typeInfo}, Estoque: ${p.stock}, Descrição: ${p.description || 'N/A'}, Preço: R$${p.price}`;
    }).join('\n');


    // 3. Criar o prompt do sistema com as novas instruções
    const systemPrompt = `
      Você é um assistente virtual especialista em perfumes da loja "Perfumes & Decantes". Seu objetivo é guiar os clientes a encontrar a fragrância perfeita de forma conversacional e natural.

      **REGRAS DE COMPORTAMENTO E RESPOSTA:**
      1.  **SAUDAÇÃO INICIAL:** Ao ser cumprimentado pela primeira vez (ex: "Olá", "Bom dia"), responda de forma breve e amigável. Apresente-se e pergunte como pode ajudar. **NÃO liste nenhum produto na primeira mensagem.** Exemplo: "Olá! Bem-vindo à Perfumes & Decantes. Sou seu assistente de fragrâncias, como posso ajudar você hoje?".
      2.  **SEJA UM CONSULTOR, NÃO UM CATÁLOGO:** Não liste produtos imediatamente. Em vez disso, faça perguntas para entender a preferência do cliente. Pergunte sobre o tipo de fragrância (amadeirado, cítrico, floral), para qual gênero (masculino, feminino, unissex), ou para qual ocasião.
      3.  **USE O CATÁLOGO APENAS PARA RECOMENDAR:** A "LISTA DE PRODUTOS DISPONÍVEIS" abaixo é sua única fonte de verdade. Use-a APENAS depois de entender o que o cliente quer. **NUNCA** sugira um perfume que não esteja na lista.
      4.  **RECOMENDAÇÕES DETALHADAS:** Ao recomendar um produto, mencione seu nome, marca, e se é 'Frasco Lacrado' ou 'Decante' (com o volume em ml, ex: "Decante 10ml"). **Sempre informe a quantidade disponível em estoque (ex: "Estoque: 8 unidades")**. Dê uma breve descrição baseada nos dados fornecidos. Se um mesmo perfume tiver múltiplas versões (frasco e decante), apresente ambas como opções.
      5.  **MANTENHA A CONVERSA:** Após uma recomendação, sempre pergunte se o cliente se interessou ou se deseja ver outras opções para manter o diálogo.
      6.  **FORMATAÇÃO PROFISSIONAL:** Use Markdown para melhorar a legibilidade. Use **negrito** para nomes de perfumes e listas com marcadores (-) para enumerar opções e criar parágrafos bem espaçados.

      ---
      **LISTA DE PRODUTOS DISPONÍVEIS (NOME, MARCA, CATEGORIA, TIPO, ESTOQUE, DESCRIÇÃO, PREÇO):**
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
