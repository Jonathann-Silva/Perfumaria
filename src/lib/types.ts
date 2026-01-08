import type { User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
export type OrderStatus = 'Pendente' | 'Concluído' | 'Cancelado';

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  costPrice?: number;
  oldPrice?: number;
  imageId: string;
  type: 'sealed' | 'decant';
  decantMl?: number;
  status: ProductStatus;
  stock: number;
  weight?: number;
  category: string;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Order = {
  id: string;
  user: string;
  email: string;
  amount: number;
  status: OrderStatus;
  timestamp: any;
  items: CartItem[];
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
