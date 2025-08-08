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
                            <TableRow key={sale.id}>
                                <TableCell>{sale.customerName}</TableCell>
                                <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{sale.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
        <RecentSales recentSales={sales} />
      </div>
    </div>
  );
}
