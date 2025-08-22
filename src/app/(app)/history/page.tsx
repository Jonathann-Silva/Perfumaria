
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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

  const filteredSales = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) {
      return sales;
    }
    return sales.filter(sale => {
      const saleDate = parseISO(sale.date);
      const from = dateRange?.from;
      const to = dateRange?.to;

      if (from && to) {
        // Set hours to the beginning and end of the day for accurate comparison
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        return saleDate >= fromDate && saleDate <= toDate;
      }
      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        return saleDate >= fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        return saleDate <= toDate;
      }
      return true;
    });
  }, [sales, dateRange]);
  
  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setDateRange(selectedRange);
    if (selectedRange?.from && selectedRange?.to) {
      setIsDatePickerOpen(false);
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Vendas</h1>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Vendas Realizadas</CardTitle>
          <div className="flex items-center gap-4 pt-4">
            <div className="grid gap-2">
              <Label>Período</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className="w-[260px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
            </div>
             { (dateRange?.from || dateRange?.to) && (
              <Button variant="ghost" onClick={() => setDateRange(undefined)} className="self-end">Limpar</Button>
            )}
          </div>
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
                {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id.substring(0, 8)}...</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                    <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                {filteredSales.length === 0 && !isLoading && (
                   <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhuma venda encontrada para o período selecionado.
                    </TableCell>
                  </TableRow>
                )}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
