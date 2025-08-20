import type { Customer, Product, Quote, Sale, Schedule } from './types';

export const customers: Customer[] = [];

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
    { 
        id: 'Q-001', 
        customerName: 'João da Silva', 
        customerPhone: '11987654321',
        vehicle: 'Toyota Corolla 2021',
        vehiclePlate: 'ABC-1234', 
        date: '2024-03-01', 
        items: [
            { name: 'Troca de Óleo do Motor', quantity: 1, price: 150.00 },
            { name: 'Filtro de Óleo', quantity: 1, price: 45.00 }
        ],
        total: 195.00, 
        status: 'Pendente' 
    },
    { 
        id: 'Q-002', 
        customerName: 'Maria Oliveira', 
        customerPhone: '21912345678',
        vehicle: 'Honda Civic 2019', 
        vehiclePlate: 'DEF-5678',
        date: '2024-03-05', 
        items: [
            { name: 'Alinhamento e Balanceamento', quantity: 1, price: 120.00 }
        ],
        total: 120.00, 
        status: 'Pendente' 
    },
    { 
        id: 'Q-003', 
        customerName: 'Carlos Pereira', 
        customerPhone: '31955551234',
        vehicle: 'Ford Ka 2022',
        vehiclePlate: 'GHI-9012',
        date: '2024-03-10', 
        items: [
            { name: 'Pastilha de Freio (par)', quantity: 1, price: 95.00 }
        ],
        total: 95.00, 
        status: 'Pendente' 
    },
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

export const schedules: Schedule[] = [
    { id: 'A-001', customerName: 'Maria Oliveira', vehicle: 'Honda Civic 2019', service: 'Revisão Completa', date: '2024-05-28', time: '10:00', status: 'Agendado' },
    { id: 'A-002', customerName: 'Carlos Pereira', vehicle: 'Ford Ka 2022', service: 'Troca de Óleo do Motor', date: '2024-05-28', time: '14:00', status: 'Agendado' },
    { id: 'A-003', customerName: 'Paulo Santos', vehicle: 'Volkswagen Gol 2018', service: 'Alinhamento e Balanceamento', date: '2024-05-29', time: '09:00', status: 'Concluído' },
    { id: 'A-004', customerName: 'João da Silva', vehicle: 'Toyota Corolla 2021', service: 'Troca de Pastilha de Freio', date: '2024-05-30', time: '11:00', status: 'Cancelado' },
];
