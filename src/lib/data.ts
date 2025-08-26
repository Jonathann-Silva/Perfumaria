
import type { Customer, Product, Quote, Sale, Schedule } from './types';

export const customers: Customer[] = [];

export const products: Product[] = [];

// This data is now managed in Firestore and will be removed.
export const quotes: Quote[] = [];

export const sales: Sale[] = [];

// This data is now fetched from Firestore.
export const schedules: Schedule[] = [];
