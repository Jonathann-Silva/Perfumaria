
'use client';

import { useState, useEffect } from 'react';
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
import { quotes } from '@/lib/data';
import type { Sale, Customer, Product } from '@/lib/types';
import { DollarSign, Users, Package, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/components/auth-provider';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const formatDisplayId = (sale: Sale) => {
    if (sale.sequentialId !== null && sale.sequentialId !== undefined) {
      return `#${sale.sequentialId.toString().padStart(4, '0')}`;
    }
    if (sale.id) {
      return `#${sale.id.substring(0, 6)}`;
    }
    return 'N/A';
};

function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

function RecentSales({ recentSales }: { recentSales: Sale[] }) {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    return (
        <Dialog open={!!selectedSale} onOpenChange={(isOpen) => !isOpen && setSelectedSale(null)}>
            <Card>
                <CardHeader>
                    <CardTitle>Vendas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentSales.map((sale) => (
                                 <DialogTrigger key={sale.id} asChild>
                                     <TableRow className="cursor-pointer" onClick={() => setSelectedSale(sale)}>
                                         <TableCell>{formatDisplayId(sale)}</TableCell>
                                         <TableCell>{sale.customerName}</TableCell>
                                         <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                                         <TableCell className="text-right">{new Date(sale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                                     </TableRow>
                                 </DialogTrigger>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedSale && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes da Venda - {formatDisplayId(selectedSale)}</DialogTitle>
                        <DialogDescription asChild>
                          <div>
                            <div><b>Cliente:</b> {selectedSale.customerName}</div>
                            <div><b>Data:</b> {new Date(selectedSale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</div>
                          </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <h4 className="font-semibold mb-2 mt-4">Itens da Venda</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Qtd.</TableHead>
                                    <TableHead className="text-right">Preço Unit.</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedSale.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <div className="text-lg font-bold">
                                Total: R$ {selectedSale.total.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    )
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pendingQuotes = quotes.filter(q => q.status === 'Pendente').length;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch sales for revenue and recent sales
        const salesCollection = collection(db, 'users', user.uid, 'sales');
        const salesQuery = query(salesCollection, orderBy('date', 'desc'));
        const salesSnapshot = await getDocs(salesQuery);
        const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        const totalRevenue = salesList.reduce((acc, sale) => acc + sale.total, 0);
        setRecentSales(salesList.slice(0, 5));
        
        // Fetch customers
        const customersCollection = collection(db, 'users', user.uid, 'customers');
        const customersSnapshot = await getDocs(customersCollection);
        
        // Fetch products
        const productsCollection = collection(db, 'users', user.uid, 'products');
        const productsSnapshot = await getDocs(productsCollection);

        setStats({
          totalRevenue,
          totalCustomers: customersSnapshot.size,
          totalProducts: productsSnapshot.size,
        });

      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
        toast({
          title: 'Erro ao carregar dashboard',
          description: 'Não foi possível buscar os dados para o painel.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Receita Total" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Clientes" value={`${stats.totalCustomers}`} icon={Users} />
        <StatCard title="Produtos e Serviços" value={`${stats.totalProducts}`} icon={Package} />
        <StatCard title="Orçamentos Pendentes" value={`${pendingQuotes}`} icon={FileText} />
      </div>
      <div>
        <RecentSales recentSales={recentSales} />
      </div>
    </div>
  );
}
