
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import type { Sale } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { WhatsAppIcon } from '@/components/icons';

const formatSequentialId = (id: number) => {
    return id.toString().padStart(4, '0');
};

export default function HistoryPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

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

  const totalFilteredSales = useMemo(() => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0);
  }, [filteredSales]);
  
  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setDateRange(selectedRange);
    if (selectedRange?.from && selectedRange?.to) {
      setIsDatePickerOpen(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!selectedSale || !selectedSale.customerPhone) {
      toast({
        title: 'Telefone do cliente não encontrado',
        description: 'Não é possível enviar a venda pois o cliente não tem telefone salvo.',
        variant: 'destructive',
      });
      return;
    }

    let message = `*Recibo de Venda - ${profile?.name || 'Oficina'}*\n\n`;
    message += `Olá ${selectedSale.customerName},\n`;
    message += `Segue o resumo da sua compra realizada em ${new Date(selectedSale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}:\n\n`;
    message += `*Itens:*\n`;
    selectedSale.items.forEach(item => {
      message += `- ${item.name} (Qtd: ${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${selectedSale.total.toFixed(2)}*\n\n`;
    message += `Agradecemos a preferência!`;

    const cleanedPhone = selectedSale.customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanedPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="space-y-6 no-print">
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
                      numberOfMonths={1}
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
              <Dialog open={!!selectedSale} onOpenChange={(isOpen) => !isOpen && setSelectedSale(null)}>
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
                      <DialogTrigger asChild key={sale.id}>
                        <TableRow className="cursor-pointer" onClick={() => setSelectedSale(sale)}>
                            <TableCell className="font-medium">#{formatSequentialId(sale.sequentialId)}</TableCell>
                            <TableCell>{sale.customerName}</TableCell>
                            <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                            <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                        </TableRow>
                      </DialogTrigger>
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
                {selectedSale && (
                  <DialogContent className="sm:max-w-xl no-print">
                      <DialogHeader>
                          <DialogTitle>Detalhes da Venda - #{formatSequentialId(selectedSale.sequentialId)}</DialogTitle>
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
                      <DialogFooter className="mt-4 justify-end">
                        <div className="flex gap-2">
                           <Button variant="outline" onClick={handleSendWhatsApp} className="bg-green-500 text-white hover:bg-green-600 hover:text-white">
                              <WhatsAppIcon className="mr-2 h-4 w-4" />
                              Enviar via WhatsApp
                            </Button>
                            <Button variant="outline" onClick={handlePrint}>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimir
                            </Button>
                        </div>
                      </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            )}
          </CardContent>
          {(dateRange?.from || dateRange?.to) && filteredSales.length > 0 && (
            <CardFooter className="justify-end">
              <div className="text-lg font-bold">
                Total do Período: R$ {totalFilteredSales.toFixed(2)}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {selectedSale && profile && (
        <div id="printable-quote" className="hidden print-only p-8">
          <header className="flex justify-between items-start mb-8">
              <div>
                  <div className="flex items-center gap-4 mb-4">
                      {profile.logoUrl && (
                         <Image src={profile.logoUrl} alt={`Logo de ${profile.name}`} width={80} height={80} className="object-contain" />
                      )}
                      <h1 className="text-3xl font-bold">{profile.name}</h1>
                  </div>
                  <p className='text-sm'>{profile.address}</p>
                  <p className='text-sm'>{profile.phone} | CNPJ: {profile.cnpj}</p>
              </div>
              <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">Recibo de Venda #{formatSequentialId(selectedSale.sequentialId)}</h2>
                  <p>Data: {new Date(selectedSale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
              </div>
          </header>

          <Card className="mb-8 border rounded-lg">
              <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-x-8 gap-y-2 text-sm'>
                  <div><span className="font-semibold">Nome:</span> {selectedSale.customerName}</div>
                  {selectedSale.customerPhone && <div><span className="font-semibold">Telefone:</span> {selectedSale.customerPhone}</div>}
                  {selectedSale.customerAddress && <div className='col-span-2'><span className="font-semibold">Endereço:</span> {selectedSale.customerAddress}</div>}
                  {selectedSale.customerVehicle && <div><span className="font-semibold">Veículo:</span> {selectedSale.customerVehicle}</div>}
                  {selectedSale.customerVehiclePlate && <div><span className="font-semibold">Placa:</span> {selectedSale.customerVehiclePlate}</div>}
              </CardContent>
          </Card>

          <h3 className="text-xl font-bold mb-4">Serviços e Peças</h3>
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className='text-center'>Qtd.</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {selectedSale.items.map((item, index) => (
                      <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className='text-center'>{item.quantity}</TableCell>
                          <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>

          <div className="flex justify-end mt-8">
              <div className="w-1/3">
                  <div className="flex justify-between text-lg">
                      <span>Total</span>
                      <span className="font-bold">R$ {selectedSale.total.toFixed(2)}</span>
                  </div>
              </div>
          </div>

          <footer className="mt-24 text-center text-sm text-muted-foreground">
              <p>Agradecemos a sua preferência!</p>
          </footer>
        </div>
      )}
    </>
  );
}
