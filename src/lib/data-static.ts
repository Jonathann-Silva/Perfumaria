import { Category } from './types';

// This is now static data as products are fetched from Firestore
export const categories: Category[] = [
  { id: '1', name: 'Floral', imageId: 'category-floral' },
  { id: '2', name: 'Amadeirado', imageId: 'category-woody' },
  { id: '3', name: 'Cítrico', imageId: 'category-citrus' },
  { id: '4', name: 'Oriental', imageId: 'category-oriental' },
  { id: '5', name: 'Decantes', imageId: 'category-decants' },
  { id: '6', name: 'Best Sellers', imageId: 'best-sellers' },
];
