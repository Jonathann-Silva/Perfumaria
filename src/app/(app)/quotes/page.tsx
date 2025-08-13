
'use client';

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { quotes } from '@/lib/data';
import { PlusCircle, Search } from 'lucide-react';

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredQuotes = useMemo(() => {
    if (!searchTerm) {
      return quotes;
    }
    return quotes.filter(
      (quote) =>
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por cliente ou veículo..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.customerName}</TableCell>
                  <TableCell>{quote.vehicle}</TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell className="text-right">
                    R$ {quote.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(quote.status)}>
                      {quote.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredQuotes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Nenhum orçamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
