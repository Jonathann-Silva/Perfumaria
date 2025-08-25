
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehiclePlate: string;
  addressStreet: string;
  addressNeighborhood: string;
  addressNumber: string;
  lastService: string;
};

export type Product = {
  id: string;
  name: string;
  type: 'Peça' | 'Serviço';
  price: number;
  purchasePrice?: number;
  stock: number;
  partCode?: string;
  brand?: string;
  vehicleCompatibility?: string;
  vehicleYear?: string;
};

export type QuoteItem = {
    name: string;
    quantity: number;
    price: number;
};

export type Quote = {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  vehicle: string;
  vehiclePlate?: string;
  date: string; // Storing as ISO string
  items: QuoteItem[];
  total: number;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
};

export type SaleItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    type: 'Peça' | 'Serviço' | 'Custom';
}

export type Sale = {
    id: string;
    customerName: string;
    customerPhone?: string;
    date: string;
    items: SaleItem[];
    total: number;
}

export type Schedule = {
  id: string;
  customerName: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  status: 'Agendado' | 'Concluído' | 'Cancelado';
};

export type ShopProfile = {
  name: string;
  phone: string;
  address: string;
  cnpj: string;
  logoUrl?: string;
};
