
import type { Customer, Product, Quote, Sale, Schedule } from './types';

export const customers: Customer[] = [];

export const products: Product[] = [];

// This data is now managed in Firestore and will be removed.
export const quotes: Quote[] = [];

export const sales: Sale[] = [];

export const schedules: Schedule[] = [
    { id: 'A-001', customerName: 'Maria Oliveira', vehicle: 'Honda Civic 2019', service: 'Revisão Completa', date: '2024-05-28', time: '10:00', status: 'Agendado' },
    { id: 'A-002', customerName: 'Carlos Pereira', vehicle: 'Ford Ka 2022', service: 'Troca de Óleo do Motor', date: '2024-05-28', time: '14:00', status: 'Agendado' },
    { id: 'A-003', customerName: 'Paulo Santos', vehicle: 'Volkswagen Gol 2018', service: 'Alinhamento e Balanceamento', date: '2024-05-29', time: '09:00', status: 'Concluído' },
    { id: 'A-004', customerName: 'João da Silva', vehicle: 'Toyota Corolla 2021', service: 'Troca de Pastilha de Freio', date: '2024-05-30', time: '11:00', status: 'Cancelado' },
];

    