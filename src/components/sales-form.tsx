
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import type { Sale, SaleItem, Product, Customer } from '@/lib/types';
import { Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';


type PaymentMethod = 'credit_card_on_time' | 'debit_card' | 'pix' | 'credit_card_installments' | '';


export function SalesForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [installments, setInstallments] = useState(2);

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);


  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productsCollection = collection(db, 'users', user.uid, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsList);

        const customersCollection = collection(db, 'users', user.uid, 'customers');
        const customersSnapshot = await getDocs(customersCollection);
        const customersList = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
        setCustomers(customersList);

      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível buscar seu inventário e clientes.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, toast]);
  
  useEffect(() => {
    const selectedCustomer = customers.find(c => c.name === customerName);
    if (selectedCustomer) {
      setVehicle(selectedCustomer.vehicle || '');
      setVehicleYear(selectedCustomer.vehicleYear || '');
      setVehiclePlate(selectedCustomer.vehiclePlate || '');
    } else {
      // If customer is not found (e.g., new customer being typed), clear vehicle fields
      setVehicle('');
      setVehicleYear('');
      setVehiclePlate('');
    }
  }, [customerName, customers]);

  const filteredProducts = useMemo(() => {
    if (!itemName) return products;
    return products.filter(p => p.name.toLowerCase().includes(itemName.toLowerCase()));
  }, [itemName, products]);

  const handleProductSelect = (product: Product) => {
    const newItem: SaleItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1, // Default quantity
      type: product.type,
    };

    setSaleItems(prevItems => [...prevItems, newItem]);
    
    // Reset fields
    setItemName('');
    setItemPrice('');
    setItemQuantity('1');
    setIsSearchPopoverOpen(false);
  };


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

  const handleFinalizeSale = async () => {
    if (!user) return;
    if (saleItems.length === 0) {
        toast({ title: 'Nenhum item na venda', description: 'Adicione pelo menos um item para registrar a venda.', variant: 'destructive', duration: 2000});
        return;
    }
     if (!customerName) {
        toast({ title: 'Cliente não informado', description: 'Por favor, informe o nome do cliente.', variant: 'destructive'});
        return;
    }
     if (!paymentMethod) {
        toast({ title: 'Forma de pagamento não selecionada', description: 'Por favor, selecione uma forma de pagamento.', variant: 'destructive'});
        return;
    }
    
    setIsSaving(true);
    
    try {
        const batch = writeBatch(db);
        const selectedCustomer = customers.find(c => c.name === customerName);

        // 1. Update stock for products
        for (const item of saleItems) {
            if (item.type === 'Peça') {
                const productRef = doc(db, 'users', user.uid, 'products', item.id);
                const productInState = products.find(p => p.id === item.id);
                if (productInState) {
                    const newStock = productInState.stock - item.quantity;
                    batch.update(productRef, { stock: newStock });
                }
            }
        }
        
        // 2. Create sale record
        const saleData: Omit<Sale, 'id'> = {
            customerName,
            customerPhone: selectedCustomer?.phone || '',
            customerAddress: selectedCustomer ? `${selectedCustomer.addressStreet}, ${selectedCustomer.addressNumber} - ${selectedCustomer.addressNeighborhood}` : '',
            customerVehicle: vehicle,
            customerVehiclePlate: vehiclePlate,
            customerVehicleYear: vehicleYear,
            items: saleItems,
            total,
            date: new Date().toISOString(),
        };

        const salesCollection = collection(db, 'users', user.uid, 'sales');
        await addDoc(salesCollection, saleData); 

        // Commit all changes
        await batch.commit();

        toast({
            title: 'Venda Finalizada!',
            description: 'A venda foi registrada e o estoque atualizado com sucesso.',
            duration: 2000,
        });

        // Reset form
        setCustomerName('');
        setSaleItems([]);
        setPaymentMethod('');
        setInstallments(2);

    } catch (error) {
        console.error("Error finalizing sale: ", error);
        toast({
            title: 'Erro ao finalizar venda',
            description: 'Não foi possível registrar a venda ou atualizar o estoque.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }

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
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-semibold">Informações do Cliente e Veículo</h3>
                    <div className="space-y-2">
                        <Label htmlFor="customer-name">Nome do Cliente</Label>
                        <Input id="customer-name" list="customers-list" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Selecione ou digite o nome do cliente" />
                        <datalist id="customers-list">
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.name} />
                            ))}
                        </datalist>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vehicle">Carro</Label>
                            <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Ex: Toyota Corolla" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicleYear">Ano do Carro</Label>
                            <Input id="vehicleYear" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} placeholder="Ex: 2021" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehiclePlate">Placa do Carro</Label>
                            <Input id="vehiclePlate" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} placeholder="Ex: ABC-1234" />
                        </div>
                    </div>
                </div>
                
                <div>
                  <Label>Itens da Venda</Label>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_auto] items-end gap-2 p-4 border rounded-t-lg bg-muted/25">
                        <div className="space-y-1.5">
                            <Label htmlFor="item-name">Adicionar Produto ou Serviço</Label>
                            <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="item-name" 
                                            value={itemName} 
                                            onChange={e => setItemName(e.target.value)} 
                                            placeholder="Digite para buscar ou adicionar novo item..."
                                            className="pl-8"
                                            autoComplete="off"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-60 overflow-y-auto p-0">
                                    {isLoading ? (
                                         <div className="flex justify-center items-center p-4">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                         </div>
                                    ) : filteredProducts.length > 0 ? (
                                        <div className="divide-y">
                                        {filteredProducts.map(product => (
                                            <button 
                                                key={product.id}
                                                onClick={() => handleProductSelect(product)}
                                                className="flex justify-between w-full text-left px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
                                                disabled={product.type === 'Peça' && product.stock <= 0}
                                            >
                                                <span>{product.name} ({product.type === 'Peça' ? `${product.stock} em estoque` : 'Serviço'})</span>
                                                <span className="text-muted-foreground">R$ {product.price.toFixed(2)}</span>
                                            </button>
                                        ))}
                                        </div>
                                    ) : (
                                        <p className="p-3 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</p>
                                    )}
                                </PopoverContent>
                            </Popover>
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
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
                    <div className="space-y-2">
                        <Label htmlFor='payment-method'>Forma de Pagamento</Label>
                        <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                            <SelectTrigger id='payment-method'>
                                <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="credit_card_on_time">Cartão de Crédito à Vista</SelectItem>
                                <SelectItem value="debit_card">Débito</SelectItem>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="credit_card_installments">Cartão de Crédito Parcelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {paymentMethod === 'credit_card_installments' && (
                        <div className='space-y-2'>
                            <Label htmlFor='installments'>Número de Parcelas</Label>
                             <Select value={String(installments)} onValueChange={(value) => setInstallments(Number(value))}>
                                <SelectTrigger id='installments'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(9)].map((_, i) => (
                                        <SelectItem key={i+2} value={String(i+2)}>{i+2}x</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-6 rounded-b-lg">
                <div className="text-2xl font-bold">Total: R$ {total.toFixed(2)}</div>
                <div className='flex gap-2'>
                  <Button size="lg" onClick={handleFinalizeSale} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Finalizar Venda
                  </Button>
                </div>
            </CardFooter>
        </Card>
      </div>
    </>
  );
}
