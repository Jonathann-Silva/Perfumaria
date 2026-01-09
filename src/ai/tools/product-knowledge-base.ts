'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const getProductInfo = ai.defineTool(
  {
    name: 'getProductInfo',
    description: 'Get information about available perfume products. Can be used to find price, stock, brand, and other details.',
    inputSchema: z.object({
      productName: z.string().describe('The name of the product to search for. Can be a partial name.'),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        brand: z.string(),
        price: z.number(),
        stock: z.number(),
        category: z.string(),
        description: z.string().optional(),
        type: z.enum(['sealed', 'decant']),
      })
    ),
  },
  async (input) => {
    if (!input.productName) {
        return [];
    }

    const productsRef = db.collection('products');
    
    // Firestore doesn't support partial string matching natively.
    // We fetch documents and filter them in memory. This is not ideal for large datasets.
    // For production, a dedicated search service like Algolia or Elasticsearch is recommended.
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
        return [];
    }
    
    const products: any[] = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name.toLowerCase().includes(input.productName.toLowerCase())) {
            products.push({ id: doc.id, ...data });
        }
    });

    return products;
  }
);
