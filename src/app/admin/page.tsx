'use client';

import {
  ShoppingBag,
  BarChart3,
  Users,
  DollarSign,
  CreditCard,
  Activity,
  Package
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, getDocs, onSnapshot, query, orderBy, limit, writeBatch, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

// Dados de exemplo para popular o Firestore se ele estiver vazio
const sampleOrders = [
  { id: '1', user: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 420.50, status: 'Concluído', timestamp: new Date() },
  { id: '2', user: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 150.00, status: 'Concluído', timestamp: new Date(Date.now() - 3600000) },
  { id: '3', user: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: 310.00, status: 'Pendente', timestamp: new Date(Date.now() - 7200000) },
  { id: '4', user: 'William Kim', email: 'will@email.com', amount: 250.00, status: 'Concluído', timestamp: new Date(Date.now() - 10800000) },
  { id: '5', user: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 99.90, status: 'Cancelado', timestamp: new Date(Date.now() - 14400000) },
];

const kpis = [
    { title: "Faturamento Total", value: "R$ 45.231,89", change: "+20.1% do último mês", icon: DollarSign },
    { title: "Vendas", value: "+12.234", change: "+19% do último mês", icon: CreditCard },
    { title: "Novos Clientes", value: "+235", change: "+180.1% do último mês", icon: Users },
    { title: "Produtos Ativos", value: "890", change: "-2 desde ontem", icon: Package }
]


export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Popula o Firestore com dados de exemplo se a coleção 'orders' estiver vazia
  useEffect(() => {
    if (!firestore) return;
    const ordersCollection = collection(firestore, 'orders');
    
    const populateData = async () => {
      const snapshot = await getDocs(ordersCollection);
      if (snapshot.empty) {
        const batch = writeBatch(firestore);
        sampleOrders.forEach(order => {
          const docRef = doc(firestore, 'orders', order.id);
          batch.set(docRef, order);
        });
        await batch.commit();
      }
    };
    populateData();
  }, [firestore]);
  
  // Ouve por mudanças na coleção 'orders' em tempo real
  useEffect(() => {
    if (!firestore) return;

    const ordersQuery = query(collection(firestore, "orders"), orderBy("timestamp", "desc"), limit(5));

    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const ordersData: any[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setRecentOrders(ordersData);
    });

    return () => unsubscribe();
  }, [firestore]);


  return (
    <div className="flex flex-col gap-8">
       <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-headline text-4xl font-black leading-tight tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Visão geral e desempenho recente da sua loja.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
            <Card key={index} className="dark:bg-[#1a190b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
              </CardContent>
            </Card>
        ))}
      </div>


      <div className="grid grid-cols-1 gap-8">
        <Card className="dark:bg-[#1a190b]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="text-primary"/>
                  Pedidos Recentes
                </CardTitle>
              </div>
              <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">Ver todos</Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{order.user}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.amount)}</TableCell>
                    <TableCell className="text-right">
                       <Badge
                        variant={
                          order.status === 'Concluído'
                            ? 'default'
                            : order.status === 'Pendente'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className={order.status === 'Concluído' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' : ''}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
