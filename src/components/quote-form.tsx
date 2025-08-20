
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Product } from '@/lib/types';
import { Plus, Trash2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { EngrenAppLogo, WhatsAppIcon } from './icons';

type QuoteItem = {
    product: Product;
    quantity: number;
}

export function QuoteForm() {
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState('');
  const [customerVehicle, setCustomerVehicle] = useState('');
  const [customerVehiclePlate, setCustomerVehiclePlate] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [isQuoteGenerated, setIsQuoteGenerated] = useState(false);

  const addCustomItemToQuote = () => {
    const price = parseFloat(customItemPrice);
    if (!customItemName || isNaN(price) || price < 0) {
        toast({
            title: 'Dados inválidos',
            description: 'Por favor, preencha o nome e um preço válido para o item.',
            variant: 'destructive'
        });
        return;
    }

    const newItem: Product = {
        id: `custom-${customItemName}-${Date.now()}`,
        name: customItemName,
        type: 'Serviço', // Defaulting to service, can be changed if needed
        price: price,
        stock: 0, // Not applicable for custom items
    };

    setQuoteItems([...quoteItems, { product: newItem, quantity: 1}]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleCustomItemKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addCustomItemToQuote();
    }
  }

  const removeProductFromQuote = (productId: string) => {
    setQuoteItems(quoteItems.filter(item => item.product.id !== productId));
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setQuoteItems(quoteItems.map(item => item.product.id === productId ? {...item, quantity: Math.max(1, quantity) } : item));
  }

  const handleGenerateQuote = () => {
    // Here you would typically save the quote to a database
    // For now, we'll just simulate it
    setIsQuoteGenerated(true);
    toast({
        title: 'Orçamento Gerado!',
        description: 'O orçamento foi salvo com sucesso e pode ser impresso ou enviado.',
        duration: 2000,
    });
  }

  const handlePrint = () => {
    window.print();
  }

  const total = quoteItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const today = new Date().toLocaleDateString('pt-BR');

  const handleSendWhatsApp = () => {
    if (!customerPhone) {
      toast({
        title: 'Telefone do cliente não encontrado',
        description: 'Por favor, insira o número de telefone do cliente para enviar o orçamento.',
        variant: 'destructive',
      });
      return;
    }

    let message = `*Orçamento EngrenApp Oficina*\n\n`;
    message += `Olá ${customerName},\n`;
    message += `Segue o orçamento para o veículo ${customerVehicle} (${customerVehiclePlate}):\n\n`;
    message += `*Itens:*\n`;
    quoteItems.forEach(item => {
      message += `- ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    message += `Este orçamento é válido por 15 dias.\n`;
    message += `Qualquer dúvida, estamos à disposição!`;

    const cleanedPhone = customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanedPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };


  return (
    <>
      <div id="quote-form-container" className="no-print">
        <Card>
            <CardHeader>
                <CardTitle>Detalhes do Orçamento</CardTitle>
                <CardDescription>Preencha os dados do cliente e adicione os itens para o orçamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className="space-y-2">
                        <Label htmlFor="customer-name">Nome do Cliente</Label>
                        <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ex: João da Silva" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customer-vehicle">Veículo</Label>
                            <Input id="customer-vehicle" value={customerVehicle} onChange={(e) => setCustomerVehicle(e.target.value)} placeholder="Ex: Toyota Corolla" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-vehicle-plate">Placa</Label>
                            <Input id="customer-vehicle-plate" value={customerVehiclePlate} onChange={(e) => setCustomerVehiclePlate(e.target.value)} placeholder="Ex: ABC-1234" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customer-email">Email</Label>
                        <Input id="customer-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Ex: joao.silva@email.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customer-phone">Telefone</Label>
                        <Input id="customer-phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Ex: (11) 98765-4321" />
                    </div>
                  </CardContent>
                </Card>
                
                <div>
                  <Label>Itens do Orçamento</Label>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] items-end gap-2 no-print p-4 border rounded-t-lg bg-muted/25">
                          <div className="space-y-1.5">
                              <Label htmlFor="custom-item-name">Adicionar Item ou Serviço</Label>
                              <Input id="custom-item-name" value={customItemName} onChange={e => setCustomItemName(e.target.value)} placeholder="Ex: Troca de pneu" />
                          </div>
                          <div className="space-y-1.5">
                              <Label htmlFor="custom-item-price">Preço</Label>
                              <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">R$</span>
                                  <Input id="custom-item-price" type="number" value={customItemPrice} onChange={e => setCustomItemPrice(e.target.value)} onKeyDown={handleCustomItemKeyDown} placeholder="50,00" className="no-spinner pl-9" />
                              </div>
                          </div>
                      <Button onClick={addCustomItemToQuote}><Plus className="mr-2 h-4 w-4"/>Adicionar</Button>
                  </div>

                  <Card className='rounded-t-none'>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead className='w-[100px]'>Qtd.</TableHead>
                                  <TableHead className="text-right w-[120px]">Preço Unit.</TableHead>
                                  <TableHead className="text-right w-[120px]">Subtotal</TableHead>
                                  <TableHead className="w-[50px] no-print"></TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {quoteItems.length === 0 && (
                                  <TableRow>
                                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                          Nenhum item adicionado
                                      </TableCell>
                                  </TableRow>
                              )}
                              {quoteItems.map(item => (
                                  <TableRow key={item.product.id}>
                                      <TableCell className="font-medium">{item.product.name} <span className='text-muted-foreground text-xs'>({item.product.type})</span></TableCell>
                                      <TableCell>
                                          <Input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))} className="w-20" min="1"/>
                                      </TableCell>
                                      <TableCell className="text-right">R$ {item.product.price.toFixed(2)}</TableCell>
                                      <TableCell className="text-right">R$ {(item.product.price * item.quantity).toFixed(2)}</TableCell>
                                      <TableCell className="no-print">
                                          <Button variant="ghost" size="icon" onClick={() => removeProductFromQuote(item.product.id)}>
                                              <Trash2 className="h-4 w-4 text-destructive"/>
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </Card>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-6 rounded-b-lg">
                <div className="text-2xl font-bold">Total: R$ {total.toFixed(2)}</div>
                <div className='flex gap-2'>
                   <Button size="lg" variant="outline" onClick={handleSendWhatsApp} disabled={!isQuoteGenerated} className="no-print bg-green-500 text-white hover:bg-green-600">
                      <WhatsAppIcon className="mr-2 h-4 w-4" />
                      Enviar via WhatsApp
                  </Button>
                  <Button size="lg" variant="outline" onClick={handlePrint} disabled={!isQuoteGenerated} className="no-print">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                  </Button>
                  <Button size="lg" onClick={handleGenerateQuote} disabled={isQuoteGenerated || quoteItems.length === 0} className="no-print">
                      {isQuoteGenerated ? 'Orçamento Gerado' : 'Gerar Orçamento'}
                  </Button>
                </div>
            </CardFooter>
        </Card>
      </div>

      <div id="printable-quote" className="hidden print-only">
        <div className="flex justify-between items-start mb-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <EngrenAppLogo className="size-10 text-primary" />
                    <h1 className="text-3xl font-bold">EngrenApp Oficina</h1>
                </div>
                <p>Avenida Paulista, 1000</p>
                <p>São Paulo - SP, 01310-100</p>
                <p>contato@autoflow.com</p>
            </div>
            <div className="text-right">
                <h2 className="text-2xl font-bold mb-2">Orçamento</h2>
                <p>Data: {today}</p>
            </div>
        </div>

        {customerName && (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                    <div><span className="font-semibold">Nome:</span> {customerName}</div>
                    {customerEmail && <div><span className="font-semibold">Email:</span> {customerEmail}</div>}
                    {customerPhone && <div><span className="font-semibold">Telefone:</span> {customerPhone}</div>}
                    {customerVehicle && <div><span className="font-semibold">Veículo:</span> {customerVehicle} {customerVehiclePlate && `(${customerVehiclePlate})`}</div>}
                </CardContent>
            </Card>
        )}

        <h3 className="text-xl font-bold mb-4">Itens do Orçamento</h3>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qtd.</TableHead>
                    <TableHead className="text-right">Preço Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quoteItems.map(item => (
                    <TableRow key={item.product.id}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">R$ {item.product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {(item.product.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        <div className="flex justify-end mt-8">
            <div className="w-1/3">
                <div className="flex justify-between text-lg">
                    <span>Total</span>
                    <span className="font-bold">R$ {total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div className="mt-24 text-center text-sm text-muted-foreground">
            <p>Este orçamento é válido por 15 dias.</p>
            <p>Obrigado pela sua preferência!</p>
        </div>
      </div>
    </>
  );
}
