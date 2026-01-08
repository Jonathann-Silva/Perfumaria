import type { User } from 'firebase/auth';

export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  imageId: string;
  type: 'sealed' | 'decant';
  decantMl?: number;
  status: ProductStatus;
  stock: number;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  imageId: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type FirebaseUser = User;