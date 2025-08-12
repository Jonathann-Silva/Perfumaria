export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  lastService: string;
};

export type Product = {
  id:string;
  name: string;
  type: 'Peça' | 'Serviço';
  price: number;
  stock: number;
};

export type Quote = {
  id: string;
  customerName: string;
  vehicle: string;
  date: string;
  total: number;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
};

export type Sale = {
    id: string;
    customerName: string;
    date: string;
    items: { name: string; quantity: number; price: number }[];
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
