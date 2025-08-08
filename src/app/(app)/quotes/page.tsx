import { Button } from '@/components/ui/button';
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
import { quotes } from '@/lib/data';
import { PlusCircle } from 'lucide-react';

export default function QuotesPage() {
  const getStatusVariant = (status: 'Pendente' | 'Aprovado' | 'Rejeitado') => {
    switch (status) {
      case 'Aprovado':
        return 'default';
      case 'Pendente':
        return 'secondary';
      case 'Rejeitado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
        <Button asChild>
          <a href="/quotes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Orçamento
          </a>
        </Button>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Histórico de Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.customerName}</TableCell>
                  <TableCell>{quote.vehicle}</TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell className="text-right">R$ {quote.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(quote.status)}>{quote.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
