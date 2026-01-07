import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
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

const kpis = [
  {
    icon: DollarSign,
    title: 'Faturamento Total',
    value: 'R$ 45.231,89',
    change: '+20.1% do último mês',
    changeType: 'increase',
  },
  {
    icon: ShoppingBag,
    title: 'Vendas',
    value: '+12.234',
    change: '+19% do último mês',
    changeType: 'increase',
  },
  {
    icon: Users,
    title: 'Novos Clientes',
    value: '+235',
    change: '+180.1% do último mês',
    changeType: 'increase',
  },
  {
    icon: Package,
    title: 'Produtos Ativos',
    value: '890',
    change: '-2 desde ontem',
    changeType: 'decrease',
  },
];

const recentOrders = [
  {
    user: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: 'R$ 420,50',
    status: 'Concluído',
  },
  {
    user: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: 'R$ 150,00',
    status: 'Concluído',
  },
  {
    user: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: 'R$ 310,00',
    status: 'Pendente',
  },
  {
    user: 'William Kim',
    email: 'will@email.com',
    amount: 'R$ 250,00',
    status: 'Concluído',
  },
  {
    user: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: 'R$ 99,90',
    status: 'Cancelado',
  },
];

export default function AdminDashboardPage() {
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="dark:bg-[#1a190b]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                 {kpi.changeType === 'increase' ? <ArrowUpRight className="size-3 text-green-500"/> : <ArrowDownRight className="size-3 text-red-500" />}
                <span className={kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>{kpi.change}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3 dark:bg-[#1a190b]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="text-primary"/>
                  Pedidos Recentes
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Você teve 265 vendas este mês.</p>
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
                    <TableCell>{order.amount}</TableCell>
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
        <Card className="lg:col-span-2 dark:bg-[#1a190b]">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary"/>
                Visão Geral
              </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <p className="text-sm text-muted-foreground">Gráfico de desempenho será exibido aqui.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
