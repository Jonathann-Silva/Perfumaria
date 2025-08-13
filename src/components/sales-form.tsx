
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
import { products } from '@/lib/data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

type SaleItem = {
    product: Product;
    quantity: number;
}

export function SalesForm() {
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

  const addProductToSale = () => {
    if (!selectedProductId) {
        toast({
            title: 'Nenhum produto selecionado',
            description: 'Por favor, selecione um produto ou serviço para adicionar.',
            variant: 'destructive'
        });
        return;
    }
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItem = saleItems.find(item => item.product.id === product.id);

    if (existingItem) {
        updateQuantity(product.id, existingItem.quantity + 1);
    } else {
        setSaleItems([...saleItems, { product, quantity: 1}]);
    }
    setSelectedProductId(undefined);
  };

  const removeProductFromSale = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.product.id !== productId));
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setSaleItems(saleItems.map(item => item.product.id === productId ? {...item, quantity: Math.max(1, quantity) } : item));
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

  const total = saleItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

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
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-2 p-4 border rounded-t-lg bg-muted/25">
                        <div className="space-y-1.5">
                            <Label>Adicionar Produto ou Serviço</Label>
                             <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um item..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={product.id}>{product.name} - R$ {product.price.toFixed(2)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                      <Button onClick={addProductToSale}><Plus className="mr-2 h-4 w-4"/>Adicionar</Button>
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
                                  <TableRow key={item.product.id}>
                                      <TableCell className="font-medium">{item.product.name} <span className='text-muted-foreground text-xs'>({item.product.type})</span></TableCell>
                                      <TableCell>
                                          <Input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))} className="w-20" min="1"/>
                                      </TableCell>
                                      <TableCell className="text-right">R$ {item.product.price.toFixed(2)}</TableCell>
                                      <TableCell className="text-right">R$ {(item.product.price * item.quantity).toFixed(2)}</TableCell>
                                      <TableCell>
                                          <Button variant="ghost" size="icon" onClick={() => removeProductFromSale(item.product.id)}>
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
