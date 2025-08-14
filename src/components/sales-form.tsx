
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
import type { SaleItem } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';

export function SalesForm() {
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');

  const addItemToSale = () => {
    const price = parseFloat(itemPrice);
    const quantity = parseInt(itemQuantity, 10);

    if (!itemName || isNaN(price) || price < 0 || isNaN(quantity) || quantity <= 0) {
        toast({
            title: 'Dados inválidos',
            description: 'Por favor, preencha nome, preço e quantidade válidos para o item.',
            variant: 'destructive'
        });
        return;
    }

    const newItem: SaleItem = {
        id: `custom-${itemName}-${Date.now()}`,
        name: itemName,
        price: price,
        quantity: quantity,
        type: 'Custom'
    };

    setSaleItems([...saleItems, newItem]);

    // Reset fields
    setItemName('');
    setItemPrice('');
    setItemQuantity('1');
  };
  
  const handleItemInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addItemToSale();
    }
  }

  const removeProductFromSale = (itemId: string) => {
    setSaleItems(saleItems.filter(item => item.id !== itemId));
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setSaleItems(saleItems.map(item => item.id === itemId ? {...item, quantity: Math.max(1, quantity) } : item));
  }

  const handleFinalizeSale = () => {
    if (saleItems.length === 0) {
        toast({ title: 'Nenhum item na venda', description: 'Adicione pelo menos um item para registrar a venda.', variant: 'destructive'});
        return;
    }
     if (!customerName) {
        toast({ title: 'Cliente não informado', description: 'Por favor, informe o nome do cliente.', variant: 'destructive'});
        return;
    }

    // Here you would typically save the sale to a database
    console.log({
        customerName,
        items: saleItems,
        total,
    });
    
    toast({
        title: 'Venda Finalizada!',
        description: 'A venda foi registrada com sucesso.'
    });

    // Reset form
    setCustomerName('');
    setSaleItems([]);
  }

  const total = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div id="sales-form-container">
        <Card>
            <CardHeader>
                <CardDescription>Preencha os dados e adicione os itens para registrar a venda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="customer-name">Nome do Cliente</Label>
                    <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ex: João da Silva" />
                </div>
                
                <div>
                  <Label>Itens da Venda</Label>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_auto] items-end gap-2 p-4 border rounded-t-lg bg-muted/25">
                        <div className="space-y-1.5">
                            <Label htmlFor="item-name">Adicionar Produto ou Serviço</Label>
                            <Input id="item-name" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Ex: Troca de pneu" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="item-price">Preço</Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">R$</span>
                                <Input id="item-price" type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="50,00" className="no-spinner pl-9" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="item-quantity">Qtd.</Label>
                            <Input id="item-quantity" type="number" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} onKeyDown={handleItemInputKeyDown} min="1" className="no-spinner" />
                        </div>
                      <Button onClick={addItemToSale}><Plus className="mr-2 h-4 w-4"/>Adicionar</Button>
                  </div>

                  <Card className='rounded-t-none'>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead className='w-[100px]'>Qtd.</TableHead>
                                  <TableHead className="text-right w-[120px]">Preço Unit.</TableHead>
                                  <TableHead className="text-right w-[120px]">Subtotal</TableHead>
                                  <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {saleItems.length === 0 && (
                                  <TableRow>
                                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                          Nenhum item adicionado
                                      </TableCell>
                                  </TableRow>
                              )}
                              {saleItems.map(item => (
                                  <TableRow key={item.id}>
                                      <TableCell className="font-medium">{item.name}</TableCell>
                                      <TableCell>
                                          <Input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-20" min="1"/>
                                      </TableCell>
                                      <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                                      <TableCell className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                      <TableCell>
                                          <Button variant="ghost" size="icon" onClick={() => removeProductFromSale(item.id)}>
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
                  <Button size="lg" onClick={handleFinalizeSale}>
                      Finalizar Venda
                  </Button>
                </div>
            </CardFooter>
        </Card>
      </div>
    </>
  );
}
