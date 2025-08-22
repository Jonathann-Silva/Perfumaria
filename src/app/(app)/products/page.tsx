
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Product } from '@/lib/types';
import { PlusCircle, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';

export default function ProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState({
    name: '',
    type: 'Peça' as 'Peça' | 'Serviço',
    price: '',
    purchasePrice: '',
    stock: '',
    partCode: '',
    brand: '',
    vehicleCompatibility: '',
    vehicleYear: '',
  });

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const productsCollection = collection(db, 'users', user.uid, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
      toast({
        title: 'Erro ao buscar produtos',
        description: 'Não foi possível carregar a lista de produtos e serviços.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user) {
      fetchProducts();
    }
  }, [user]);

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      setProductData({
        name: product.name,
        type: product.type,
        price: String(product.price),
        purchasePrice: String(product.purchasePrice || ''),
        stock: String(product.stock),
        partCode: product.partCode || '',
        brand: product.brand || '',
        vehicleCompatibility: product.vehicleCompatibility || '',
        vehicleYear: product.vehicleYear || '',
      });
    } else {
      setProductData({
        name: '',
        type: 'Peça',
        price: '',
        purchasePrice: '',
        stock: '',
        partCode: '',
        brand: '',
        vehicleCompatibility: '',
        vehicleYear: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProductData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleTypeChange = (value: 'Peça' | 'Serviço') => {
      setProductData(prev => ({ ...prev, type: value, purchasePrice: value === 'Serviço' ? '' : prev.purchasePrice, stock: value === 'Serviço' ? '' : prev.stock }));
  }

  const handleSave = async () => {
    if (!user) return;
    
    const price = parseFloat(productData.price);
    const purchasePrice = parseFloat(productData.purchasePrice);
    const stock = productData.type === 'Peça' ? parseInt(productData.stock, 10) : 0;

    if (!productData.name || isNaN(price) || (productData.type === 'Peça' && (isNaN(stock) || isNaN(purchasePrice)))) {
        toast({ title: 'Dados inválidos', description: 'Por favor, preencha todos os campos corretamente.', variant: 'destructive' });
        return;
    }

    try {
        if (editingProduct) {
            // Update existing product
            const productDoc = doc(db, 'users', user.uid, 'products', editingProduct.id);
            const updatedData: Product = { 
                ...editingProduct, 
                name: productData.name,
                type: productData.type,
                price, 
                purchasePrice: productData.type === 'Peça' ? purchasePrice : 0,
                stock: productData.type === 'Peça' ? stock : 999,
                partCode: productData.partCode,
                brand: productData.brand,
                vehicleCompatibility: productData.vehicleCompatibility,
                vehicleYear: productData.vehicleYear,
            };
            await updateDoc(productDoc, updatedData);
            setProducts(products.map(p => p.id === editingProduct.id ? updatedData : p));
            toast({ title: 'Produto atualizado!', description: 'O item foi salvo com sucesso.' });
        } else {
            // Add new product
            const newProduct: Omit<Product, 'id'> = {
                name: productData.name,
                type: productData.type,
                price,
                purchasePrice: productData.type === 'Peça' ? purchasePrice : 0,
                stock: productData.type === 'Peça' ? stock : 999,
                partCode: productData.partCode,
                brand: productData.brand,
                vehicleCompatibility: productData.vehicleCompatibility,
                vehicleYear: productData.vehicleYear,
            };
            const docRef = await addDoc(collection(db, 'users', user.uid, 'products'), newProduct);
            setProducts([...products, { id: docRef.id, ...newProduct }]);
            toast({ title: 'Produto adicionado!', description: 'O novo item foi salvo com sucesso.' });
        }
        handleCloseDialog();
    } catch (error) {
        console.error("Error saving product: ", error);
        toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar o item.', variant: 'destructive' });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'users', user.uid, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
        toast({ title: 'Produto removido!', description: 'O item foi removido com sucesso.' });
    } catch (error) {
        console.error("Error deleting product: ", error);
        toast({ title: 'Erro ao remover', description: 'Não foi possível remover o item.', variant: 'destructive' });
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Produtos e Serviços</h1>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Produto/Serviço
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Inventário</CardTitle>
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
                        <TableHead>Nome</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Veículo Compatível</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Preço de Compra</TableHead>
                        <TableHead className="text-right">Preço de Venda</TableHead>
                        <TableHead className="text-right">Estoque</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.partCode}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.vehicleCompatibility} {product.vehicleYear && `(${product.vehicleYear})`}</TableCell>
                        <TableCell>{product.type}</TableCell>
                        <TableCell className="text-right">{product.type === 'Peça' ? `R$ ${product.purchasePrice?.toFixed(2)}` : 'N/A'}</TableCell>
                        <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.type === 'Peça' ? product.stock : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar' : 'Adicionar'} Produto/Serviço</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={productData.name} onChange={handleInputChange} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="partCode">Código da Peça</Label>
                    <Input id="partCode" value={productData.partCode} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input id="brand" value={productData.brand} onChange={handleInputChange} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="vehicleCompatibility">Carro</Label>
                    <Input id="vehicleCompatibility" value={productData.vehicleCompatibility} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Ano</Label>
                    <Input id="vehicleYear" value={productData.vehicleYear} onChange={handleInputChange} />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={productData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger id="type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Peça">Peça</SelectItem>
                        <SelectItem value="Serviço">Serviço</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="price">Preço de Venda</Label>
                    <Input id="price" type="number" value={productData.price} onChange={handleInputChange} />
                </div>
                {productData.type === 'Peça' && (
                    <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Preço de Compra</Label>
                        <Input id="purchasePrice" type="number" value={productData.purchasePrice} onChange={handleInputChange} />
                    </div>
                )}
            </div>
             {productData.type === 'Peça' && (
                <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input id="stock" type="number" value={productData.stock} onChange={handleInputChange} />
                </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
