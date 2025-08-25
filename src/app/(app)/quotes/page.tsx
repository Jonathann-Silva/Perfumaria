
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Quote } from '@/lib/types';
import { PlusCircle, Search, Printer, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppIcon } from '@/components/icons';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const formatDisplayId = (quote: Quote) => {
    if (quote.sequentialId !== null && quote.sequentialId !== undefined) {
      return `#${quote.sequentialId.toString().padStart(4, '0')}`;
    }
    return '';
};


export default function QuotesPage() {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [quotesData, setQuotesData] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const quotesCollection = collection(db, 'users', user.uid, 'quotes');
        const q = query(quotesCollection, orderBy('date', 'desc'));
        const quotesSnapshot = await getDocs(q);
        const quotesList = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
        setQuotesData(quotesList);
      } catch (error) {
        console.error("Error fetching quotes: ", error);
        toast({
          title: 'Erro ao buscar orçamentos',
          description: 'Não foi possível carregar a lista de orçamentos.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [user, toast]);

  const handleStatusChange = async (quoteId: string, newStatus: 'Pendente' | 'Aprovado' | 'Rejeitado') => {
    if (!user) return;

    try {
      const quoteDoc = doc(db, 'users', user.uid, 'quotes', quoteId);
      await updateDoc(quoteDoc, { status: newStatus });
      
      const updatedQuotes = quotesData.map((quote) => {
        if (quote.id === quoteId) {
          return { ...quote, status: newStatus };
        }
        return quote;
      });
      setQuotesData(updatedQuotes);
      if(selectedQuote) {
          setSelectedQuote({...selectedQuote, status: newStatus})
      }
       toast({
          title: 'Status atualizado!',
          description: 'O status do orçamento foi alterado com sucesso.',
      });
    } catch (error) {
        console.error("Error updating status: ", error);
        toast({
            title: 'Erro ao atualizar status',
            description: 'Não foi possível alterar o status do orçamento.',
            variant: 'destructive',
        });
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'quotes', quoteId));
      const updatedQuotes = quotesData.filter((quote) => quote.id !== quoteId);
      setQuotesData(updatedQuotes);
      setSelectedQuote(null);
      toast({
          title: 'Orçamento excluído',
          description: 'O orçamento foi removido com sucesso.',
      });
    } catch(error) {
       console.error("Error deleting quote: ", error);
       toast({
          title: 'Erro ao excluir',
          description: 'Não foi possível remover o orçamento.',
          variant: 'destructive',
      });
    }
  };

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
      return quotesData;
    }
    return quotesData.filter(
      (quote) =>
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.vehicle && quote.vehicle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, quotesData]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!selectedQuote || !selectedQuote.customerPhone) {
      toast({
        title: 'Telefone do cliente não encontrado',
        description: 'Por favor, adicione o número de telefone do cliente para enviar.',
        variant: 'destructive',
      });
      return;
    }

    let message = `*Orçamento ${profile?.name || 'Oficina'}*\n\n`;
    message += `Olá ${selectedQuote.customerName},\n`;
    message += `Segue o orçamento para o veículo ${selectedQuote.vehicle} (${selectedQuote.vehiclePlate || ''}):\n\n`;
    message += `*Itens:*\n`;
    selectedQuote.items.forEach(item => {
      message += `- ${item.name} (Qtd: ${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${selectedQuote.total.toFixed(2)}*\n\n`;
    message += `Este orçamento é válido por 15 dias.\n`;
    message += `Qualquer dúvida, estamos à disposição!`;

    const cleanedPhone = selectedQuote.customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanedPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="space-y-6 no-print">
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
                    <TableHead>Veículo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredQuotes.map((quote) => (
                    <TableRow
                        key={quote.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedQuote(quote)}
                    >
                        <TableCell className="font-medium">{formatDisplayId(quote)}</TableCell>
                        <TableCell>{quote.customerName}</TableCell>
                        <TableCell>{quote.vehicle}</TableCell>
                        <TableCell>{new Date(quote.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
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
             )}
          </CardContent>
        </Card>
      </div>
      
      {selectedQuote && (
        <Dialog
          open={!!selectedQuote}
          onOpenChange={(isOpen) => !isOpen && setSelectedQuote(null)}
        >
          <DialogContent className="max-w-3xl no-print">
            <DialogHeader>
              <DialogTitle>Detalhes do Orçamento - {formatDisplayId(selectedQuote)}</DialogTitle>
              <DialogDescription asChild>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
                    <div><b>Cliente:</b> {selectedQuote.customerName}</div>
                    <div><b>Veículo:</b> {selectedQuote.vehicle} {selectedQuote.vehiclePlate && `(${selectedQuote.vehiclePlate})`}</div>
                    <div><b>Data:</b> {new Date(selectedQuote.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</div>
                     <div className='flex items-center gap-2'>
                      <b>Status:</b>
                      <Select 
                          value={selectedQuote.status} 
                          onValueChange={(newStatus: 'Pendente' | 'Aprovado' | 'Rejeitado') => handleStatusChange(selectedQuote.id, newStatus)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue>
                             <Badge variant={getStatusVariant(selectedQuote.status)}>{selectedQuote.status}</Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                     </div>
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
             <DialogFooter className='mt-4 sm:justify-between'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="sm:mr-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Orçamento
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá excluir permanentemente o orçamento <span className="font-medium">{formatDisplayId(selectedQuote)}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteQuote(selectedQuote.id)}>
                        Sim, Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex gap-2 justify-end">
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
        </Dialog>
      )}

      {selectedQuote && profile && (
        <div id="printable-quote" className="hidden print-only">
          <div className="flex justify-between items-start mb-8">
              <div>
                  <div className="flex items-center gap-4 mb-4">
                      {profile.logoUrl ? (
                         <Image src={profile.logoUrl} alt={`Logo de ${profile.name}`} width={80} height={80} className="object-contain" />
                      ) : null}
                      <h1 className="text-3xl font-bold">{profile.name}</h1>
                  </div>
                  <p>{profile.address}</p>
                  <p>{profile.phone} | CNPJ: {profile.cnpj}</p>
              </div>
              <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">Orçamento {formatDisplayId(selectedQuote)}</h2>
                  <p>Data: {new Date(selectedQuote.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
              </div>
          </div>

          <Card className="mb-8">
              <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-4'>
                  <div><span className="font-semibold">Nome:</span> {selectedQuote.customerName}</div>
                  {selectedQuote.customerPhone && <div><span className="font-semibold">Telefone:</span> {selectedQuote.customerPhone}</div>}
                  {selectedQuote.vehicle && <div><span className="font-semibold">Veículo:</span> {selectedQuote.vehicle} {selectedQuote.vehiclePlate && `(${selectedQuote.vehiclePlate})`}</div>}
              </CardContent>
          </Card>

          <h3 className="text-xl font-bold mb-4">Itens do Orçamento</h3>
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
                  {selectedQuote.items.map(item => (
                      <TableRow key={item.name}>
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
                      <span className="font-bold">R$ {selectedQuote.total.toFixed(2)}</span>
                  </div>
              </div>
          </div>

          <div className="mt-24 text-center text-sm text-muted-foreground">
              <p>Este orçamento é válido por 15 dias.</p>
              <p>Obrigado pela sua preferência!</p>
          </div>
        </div>
      )}
    </>
  );
}
