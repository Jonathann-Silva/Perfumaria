'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CloudUpload, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { getImageById } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  imageUrl: z.string().url('URL da imagem inválida').min(1, 'URL da Imagem 1 é obrigatória'),
  imageUrl2: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  imageUrl3: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  price: z.number().min(0.01, 'Preço é obrigatório'),
  costPrice: z.number().optional(),
  stock: z.number().int().min(0, 'Estoque é obrigatório'),
  weight: z.number().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['sealed', 'decant']),
  decantMl: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: Product | null;
  onSave: () => void;
}

export function ProductForm({ product, onSave }: ProductFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        imageUrl2: product.imageUrl2,
        imageUrl3: product.imageUrl3,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        weight: product.weight,
        category: product.category,
        description: product.description || 'Pre-filled description from data.',
        type: product.type,
        decantMl: product.decantMl,
      });
    } else {
      reset({
        name: '',
        brand: '',
        imageUrl: '',
        imageUrl2: '',
        imageUrl3: '',
        price: 0,
        costPrice: 0,
        stock: 0,
        weight: 0,
        category: '',
        description: '',
        type: 'sealed',
        decantMl: 0,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Erro de Conexão', description: 'Não foi possível conectar ao banco de dados.' });
        return;
    }

    setIsSaving(true);
    
    let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
    if (data.stock === 0) {
        status = 'out-of-stock';
    } else if (data.stock < 10) {
        status = 'low-stock';
    }

    const productData = {
        ...data,
        status,
        price: Number(data.price),
        costPrice: Number(data.costPrice) || null,
        stock: Number(data.stock),
        weight: Number(data.weight) || null,
    };

    try {
        if (product && product.id) {
            const productRef = doc(firestore, 'products', product.id);
            await setDoc(productRef, { ...productData, updatedAt: serverTimestamp() }, { merge: true });
            toast({ title: 'Produto Atualizado!', description: `O produto "${data.name}" foi atualizado com sucesso.` });
        } else {
            const productsCollection = collection(firestore, 'products');
            await addDoc(productsCollection, { ...productData, createdAt: serverTimestamp() });
            toast({ title: 'Produto Criado!', description: `O produto "${data.name}" foi criado com sucesso.` });
        }
        onSave();
    } catch (error) {
        console.error("Error saving product: ", error);
        toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível salvar o produto.' });
    } finally {
        setIsSaving(false);
    }
  };

  const imageUrl = watch('imageUrl');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-4">
        <div className="flex flex-col gap-4">
            <div>
                <Label htmlFor="imageUrl">URL da Imagem Principal</Label>
                <Input id="imageUrl" {...register('imageUrl')} placeholder="https://exemplo.com/imagem.jpg" />
                {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
            </div>
             <div>
                <Label htmlFor="imageUrl2">URL da Imagem 2 (Opcional)</Label>
                <Input id="imageUrl2" {...register('imageUrl2')} placeholder="https://exemplo.com/imagem2.jpg" />
                {errors.imageUrl2 && <p className="text-sm text-destructive">{errors.imageUrl2.message}</p>}
            </div>
             <div>
                <Label htmlFor="imageUrl3">URL da Imagem 3 (Opcional)</Label>
                <Input id="imageUrl3" {...register('imageUrl3')} placeholder="https://exemplo.com/imagem3.jpg" />
                {errors.imageUrl3 && <p className="text-sm text-destructive">{errors.imageUrl3.message}</p>}
            </div>
             {imageUrl && (
                <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Pré-visualização da Imagem Principal:</p>
                    <div className="relative w-32 h-32 rounded-lg border overflow-hidden">
                        <Image src={imageUrl} alt="Pré-visualização do produto" fill className="object-cover" />
                    </div>
                </div>
            )}
        </div>


      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome do Perfume</Label>
          <Input id="name" {...register('name')} placeholder="Ex: Sauvage Elixir" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" {...register('brand')} placeholder="Ex: Dior" />
           {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Preço de Venda (R$)</Label>
          <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} placeholder="99,90" />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
         <div className="flex flex-col gap-2">
          <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
          <Input id="costPrice" type="number" step="0.01" {...register('costPrice', { valueAsNumber: true })} placeholder="50,00" />
          {errors.costPrice && <p className="text-sm text-destructive">{errors.costPrice.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="stock">Estoque (Qtd)</Label>
          <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} placeholder="0" />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weight">Peso (g)</Label>
          <Input id="weight" type="number" {...register('weight', { valueAsNumber: true })} placeholder="300" />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frasco">Perfume (Frasco)</SelectItem>
                  <SelectItem value="Decante">Decante</SelectItem>
                  <SelectItem value="Tester">Tester</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>
      </div>

       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Tipo</Label>
               <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sealed">Frasco Lacrado</SelectItem>
                      <SelectItem value="decant">Decante</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>
            {watch('type') === 'decant' && (
               <div className="flex flex-col gap-2">
                <Label htmlFor="decantMl">Volume do Decante (ml)</Label>
                <Input id="decantMl" type="number" {...register('decantMl', { valueAsNumber: true })} placeholder="5" />
                {errors.decantMl && <p className="text-sm text-destructive">{errors.decantMl.message}</p>}
              </div>
            )}
        </div>
      
      <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description">Descrição do Produto</Label>
          </div>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descreva as notas de topo, corpo e fundo..."
            rows={6}
          />
           {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button type="submit" disabled={isSaving} className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-yellow-400">
          {isSaving ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  );
}
