import type { Customer, Product, Quote, Sale } from './types';

export const customers: Customer[] = [
  { id: '1', name: 'João da Silva', email: 'joao.silva@email.com', phone: '(11) 98765-4321', vehicle: 'Toyota Corolla 2021', lastService: '2023-10-15' },
  { id: '2', name: 'Maria Oliveira', email: 'maria.o@email.com', phone: '(21) 91234-5678', vehicle: 'Honda Civic 2019', lastService: '2023-11-20' },
  { id: '3', name: 'Carlos Pereira', email: 'carlos.p@email.com', phone: '(31) 95555-1234', vehicle: 'Ford Ka 2022', lastService: '2024-01-05' },
  { id: '4', name: 'Ana Souza', email: 'ana.souza@email.com', phone: '(41) 98888-9999', vehicle: 'Chevrolet Onix 2020', lastService: '2023-09-01' },
  { id: '5', name: 'Paulo Santos', email: 'paulo.santos@email.com', phone: '(51) 97777-6666', vehicle: 'Volkswagen Gol 2018', lastService: '2024-02-10' },
];

export const products: Product[] = [
  { id: '1', name: 'Troca de Óleo do Motor', type: 'Serviço', price: 150.00, stock: 999 },
  { id: '2', name: 'Filtro de Óleo', type: 'Peça', price: 45.00, stock: 50 },
  { id: '3', name: 'Alinhamento e Balanceamento', type: 'Serviço', price: 120.00, stock: 999 },
  { id: '4', name: 'Pastilha de Freio (par)', type: 'Peça', price: 95.00, stock: 30 },
  { id: '5', name: 'Revisão Completa', type: 'Serviço', price: 450.00, stock: 999 },
  { id: '6', name: 'Vela de Ignição', type: 'Peça', price: 25.00, stock: 100 },
  { id: '7', name: 'Bateria Automotiva', type: 'Peça', price: 350.00, stock: 15 },
  { id: '8', name: 'Limpeza de Bicos Injetores', type: 'Serviço', price: 180.00, stock: 999 },
];

export const quotes: Quote[] = [
    { id: 'Q-001', customerName: 'João da Silva', vehicle: 'Toyota Corolla 2021', date: '2024-03-01', total: 195.00, status: 'Aprovado' },
    { id: 'Q-002', customerName: 'Maria Oliveira', vehicle: 'Honda Civic 2019', date: '2024-03-05', total: 120.00, status: 'Pendente' },
    { id: 'Q-003', customerName: 'Carlos Pereira', vehicle: 'Ford Ka 2022', date: '2024-03-10', total: 95.00, status: 'Rejeitado' },
];

export const sales: Sale[] = [
    { id: 'S-001', customerName: 'João da Silva', date: '2024-03-02', items: [
        { name: 'Troca de Óleo do Motor', quantity: 1, price: 150.00 },
        { name: 'Filtro de Óleo', quantity: 1, price: 45.00 },
    ], total: 195.00 },
    { id: 'S-002', customerName: 'Ana Souza', date: '2024-02-28', items: [
        { name: 'Pastilha de Freio (par)', quantity: 2, price: 95.00 },
    ], total: 190.00 },
];
