
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
import type { Quote } from '@/lib/types';
import { PlusCircle, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

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
                <Dialog key={quote.id}>
                  <DialogTrigger asChild>
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => setSelectedQuote(quote)}
                    >
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
                  </DialogTrigger>
                </Dialog>
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

          {selectedQuote && (
            <Dialog
              open={!!selectedQuote}
              onOpenChange={(isOpen) => !isOpen && setSelectedQuote(null)}
            >
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Detalhes do Orçamento - {selectedQuote.id}</DialogTitle>
                  <DialogDescription asChild>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
                        <div><b>Cliente:</b> {selectedQuote.customerName}</div>
                        <div><b>Veículo:</b> {selectedQuote.vehicle}</div>
                        <div><b>Data:</b> {selectedQuote.date}</div>
                        <div><b>Status:</b> <Badge variant={getStatusVariant(selectedQuote.status)}>{selectedQuote.status}</Badge></div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <h4 className="mb-2 mt-4 font-semibold">Itens do Orçamento</h4>
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
                      {selectedQuote.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end">
                    <div className="text-lg font-bold">
                      Total: R$ {selectedQuote.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
