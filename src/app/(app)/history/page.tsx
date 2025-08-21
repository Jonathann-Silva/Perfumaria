
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import type { Sale } from '@/lib/types';
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
import { Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      if (!user) return;
      try {
        const salesCollection = collection(db, 'users', user.uid, 'sales');
        const q = query(salesCollection, orderBy('date', 'desc'));
        const salesSnapshot = await getDocs(q);
        const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        setSales(salesList);
      } catch (error) {
        console.error("Error fetching sales history: ", error);
        toast({
          title: 'Erro ao buscar histórico',
          description: 'Não foi possível carregar o histórico de vendas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, [user, toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Vendas</h1>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Vendas Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sales.map((sale) => (
                    <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id.substring(0, 8)}...</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                    <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
