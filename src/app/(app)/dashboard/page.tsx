
'use client';

import { useState } from 'react';
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
import { customers, products, quotes, sales } from '@/lib/data';
import type { Sale } from '@/lib/types';
import { DollarSign, Users, Package, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';


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
        <Card>
            <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Data</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentSales.map((sale) => (
                             <Dialog key={sale.id}>
                                <DialogTrigger asChild>
                                    <TableRow className="cursor-pointer" onClick={() => setSelectedSale(sale)}>
                                        <TableCell>{sale.customerName}</TableCell>
                                        <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{sale.date}</TableCell>
                                    </TableRow>
                                </DialogTrigger>
                             </Dialog>
                        ))}
                    </TableBody>
                </Table>

                 {selectedSale && (
                    <Dialog open={!!selectedSale} onOpenChange={(isOpen) => !isOpen && setSelectedSale(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Detalhes da Venda - {selectedSale.id}</DialogTitle>
                                <DialogDescription>
                                    <p><b>Cliente:</b> {selectedSale.customerName}</p>
                                    <p><b>Data:</b> {selectedSale.date}</p>
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                <h4 className="font-semibold mb-2">Itens da Venda</h4>
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
                    </Dialog>
                )}
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const pendingQuotes = quotes.filter(q => q.status === 'Pendente').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Receita Total" value={`R$ ${totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Clientes" value={`${totalCustomers}`} icon={Users} />
        <StatCard title="Produtos e Serviços" value={`${totalProducts}`} icon={Package} />
        <StatCard title="Orçamentos Pendentes" value={`${pendingQuotes}`} icon={FileText} />
      </div>
      <div>
        <RecentSales recentSales={sales.slice(0, 5)} />
      </div>
    </div>
  );
}
