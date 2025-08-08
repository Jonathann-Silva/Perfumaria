
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Customer, Product } from '@/lib/types';
import {
  suggestCommonPartsServices,
  type SuggestCommonPartsServicesOutput,
} from '@/ai/flows/suggest-common-parts-services';
import { Loader2, Plus, Sparkles, Trash2, Wand2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { AutoFlowLogo } from './icons';

type QuoteItem = {
    product: Product;
    quantity: number;
}

export function QuoteForm({
  customers,
  products,
}: {
  customers: Customer[];
  products: Product[];
}) {
  const { toast } = useToast();
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [recentServices, setRecentServices] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] =
    useState<SuggestCommonPartsServicesOutput | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleGetSuggestions = async () => {
    if (!vehicleMake || !vehicleModel || !vehicleYear) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha Marca, Modelo e Ano do veículo.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestCommonPartsServices({
        vehicleMake,
        vehicleModel,
        vehicleYear: parseInt(vehicleYear, 10),
        customerName: selectedCustomer?.name || 'Cliente',
        recentServices,
      });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro na IA',
        description:
          'Não foi possível obter sugestões. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToQuote = (productName: string) => {
    const productToAdd = products.find(p => p.name === productName);
    if (productToAdd && !quoteItems.find(item => item.product.id === productToAdd.id)) {
        setQuoteItems([...quoteItems, { product: productToAdd, quantity: 1}]);
    }
  };

  const addManualProductToQuote = () => {
    if (!selectedProduct) return;
    const productToAdd = products.find(p => p.id === selectedProduct);
    if (productToAdd && !quoteItems.find(item => item.product.id === productToAdd.id)) {
        setQuoteItems([...quoteItems, { product: productToAdd, quantity: 1}]);
    }
    setSelectedProduct("");
  };

  const removeProductFromQuote = (productId: string) => {
    setQuoteItems(quoteItems.filter(item => item.product.id !== productId));
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setQuoteItems(quoteItems.map(item => item.product.id === productId ? {...item, quantity: Math.max(1, quantity) } : item));
  }

  const handlePrint = () => {
    window.print();
  }

  const total = quoteItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const today = new Date().toLocaleDateString('pt-BR');


  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 no-print">
        <div className="lg:col-span-2 printable-area">
          <Card>
              <CardHeader>
                  <CardTitle>Detalhes do Orçamento</CardTitle>
                  <CardDescription>Selecione o cliente e adicione os itens para o orçamento.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div>
                      <Label htmlFor="customer">Cliente</Label>
                      <Select onValueChange={(value) => setSelectedCustomer(customers.find(c => c.id === value) || null)}>
                          <SelectTrigger id="customer">
                              <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                          <SelectContent>
                              {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                  {customer.name} - {customer.vehicle}
                              </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  
                  <div className="space-y-2">
                      <Label>Itens do Orçamento</Label>
                      <Card>
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

                  <div className="flex items-center gap-4 no-print">
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                          <SelectTrigger>
                              <SelectValue placeholder="Adicionar produto ou serviço..." />
                          </SelectTrigger>
                          <SelectContent>
                              {products.filter(p => !quoteItems.find(qi => qi.product.id === p.id)).map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                  {product.name} (R$ {product.price.toFixed(2)})
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                      <Button onClick={addManualProductToQuote}><Plus className="mr-2 h-4 w-4"/>Adicionar Item</Button>
                  </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/50 p-6 rounded-b-lg">
                  <div className="text-2xl font-bold">Total: R$ {total.toFixed(2)}</div>
                  <div className='flex gap-2'>
                    <Button size="lg" variant="outline" onClick={handlePrint} className="no-print">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button size="lg" className="no-print">Gerar Orçamento</Button>
                  </div>
              </CardFooter>
          </Card>
        </div>

        <div className="space-y-6 no-print">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Sugestões com IA
              </CardTitle>
              <CardDescription>
                Preencha os dados do veículo para receber sugestões de peças e serviços com base no nosso modelo de IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="make">Marca</Label>
                          <Input id="make" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder="Ex: Toyota" />
                      </div>
                      <div>
                          <Label htmlFor="model">Modelo</Label>
                          <Input id="model" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Ex: Corolla" />
                      </div>
                  </div>
                  <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input id="year" type="number" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} placeholder="Ex: 2021" />
                  </div>
                  <div>
                  <Label htmlFor="history">Histórico de Serviços Recentes</Label>
                  <Textarea id="history" value={recentServices} onChange={(e) => setRecentServices(e.target.value)} placeholder="Ex: Troca de óleo há 6 meses" />
                  </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGetSuggestions}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading
                  ? 'Gerando Sugestões...'
                  : 'Obter Sugestões da IA'}
              </Button>
            </CardFooter>
          </Card>

          {suggestions && (
            <Card>
              <CardHeader>
                  <CardTitle>Sugestões Geradas</CardTitle>
              </CardHeader>
              <CardContent>
                  <Accordion type="single" collapsible defaultValue="services">
                      <AccordionItem value="services">
                          <AccordionTrigger>Serviços Sugeridos</AccordionTrigger>
                          <AccordionContent>
                              <div className="space-y-2">
                                  {suggestions.suggestedServices.map((service, index) => (
                                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                                          <span>{service}</span>
                                          <Button size="sm" variant="outline" onClick={() => addProductToQuote(service)}>
                                              <Plus className="h-4 w-4"/>
                                          </Button>
                                      </div>
                                  ))}
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="parts">
                          <AccordionTrigger>Peças Sugeridas</AccordionTrigger>
                          <AccordionContent>
                              <div className="space-y-2">
                              {suggestions.suggestedParts.map((part, index) => (
                                  <div key={index} className="flex items-center justify-between rounded-md border p-2">
                                      <span>{part}</span>
                                      <Button size="sm" variant="outline" onClick={() => addProductToQuote(part)}>
                                          <Plus className="h-4 w-4"/>
                                      </Button>
                                  </div>
                              ))}
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                  </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden print-only">
        <div className="flex justify-between items-start mb-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <AutoFlowLogo className="size-10 text-primary" />
                    <h1 className="text-3xl font-bold">AutoFlow Oficina</h1>
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

        {selectedCustomer && (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                    <div><span className="font-semibold">Nome:</span> {selectedCustomer.name}</div>
                    <div><span className="font-semibold">Email:</span> {selectedCustomer.email}</div>
                    <div><span className="font-semibold">Telefone:</span> {selectedCustomer.phone}</div>
                    <div><span className="font-semibold">Veículo:</span> {selectedCustomer.vehicle}</div>
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
