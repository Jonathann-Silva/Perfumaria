'use client';

import { useState } from 'react';
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
import { generateDescriptionAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  productName: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  price: z.number().min(0.01, 'Preço é obrigatório'),
  stock: z.number().int().min(0, 'Estoque é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  fragranceType: z.string().optional(),
  keyNotes: z.string().optional(),
  targetAudience: z.string().optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSave: () => void;
}

export function ProductForm({ onSave }: ProductFormProps) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    console.log(data);
    toast({
      title: 'Produto Salvo!',
      description: 'O produto foi salvo com sucesso.',
    });
    onSave(); // Close form on success
  };

  const handleGenerateDescription = async () => {
    const { productName, brand, fragranceType, keyNotes, targetAudience } = watch();

    if (!productName || !brand) {
      toast({
        variant: 'destructive',
        title: 'Campos Faltando',
        description: 'Por favor, preencha o Nome do Perfume e a Marca antes de gerar a descrição.',
      });
      return;
    }

    setIsPending(true);
    try {
      const result = await generateDescriptionAction({
        productName,
        brand,
        fragranceType: fragranceType || 'Não especificado',
        keyNotes: keyNotes || 'Não especificado',
        targetAudience: targetAudience || 'Unissex',
      });
      if (result.productDescription) {
        setValue('description', result.productDescription);
        toast({
          title: 'Descrição Gerada!',
          description: 'A descrição foi gerada com IA.',
        });
      } else {
        throw new Error('A descrição gerada está vazia.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na Geração',
        description: 'Não foi possível gerar a descrição com IA.',
      });
    } finally {
      setIsPending(false);
    }
  };

  const uploadPreviewImage = getImageById('upload-preview');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-3">
        <Label>Imagens do Produto</Label>
        <div className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:bg-muted dark:bg-neutral-900/50 dark:hover:bg-neutral-900">
          <div className="flex size-12 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors group-hover:text-primary dark:bg-neutral-800">
            <CloudUpload />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Clique para upload ou arraste e solte
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG ou GIF (max. 5MB)
            </p>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {uploadPreviewImage && (
            <div className="group relative size-20 shrink-0 overflow-hidden rounded-xl border">
              <Image
                src={uploadPreviewImage.imageUrl}
                alt={uploadPreviewImage.description}
                width={80}
                height={80}
                className="size-full object-cover"
                data-ai-hint={uploadPreviewImage.imageHint}
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 size-5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="productName">Nome do Perfume</Label>
          <Input id="productName" {...register('productName')} placeholder="Ex: Sauvage Elixir" />
          {errors.productName && <p className="text-sm text-destructive">{errors.productName.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brand">Marca</Label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione a marca" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dior">Dior</SelectItem>
                  <SelectItem value="chanel">Chanel</SelectItem>
                  <SelectItem value="tomford">Tom Ford</SelectItem>
                  <SelectItem value="ysl">YSL</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
           {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} placeholder="0,00" />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="stock">Estoque (Qtd)</Label>
          <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} placeholder="0" />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="frasco">Perfume (Frasco)</SelectItem>
                  <SelectItem value="decante">Decante</SelectItem>
                  <SelectItem value="tester">Tester</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>
      </div>
      
      <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
        <h3 className="font-bold text-foreground">Gerar Descrição com IA</h3>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fragranceType">Tipo de Fragrância</Label>
              <Input id="fragranceType" {...register('fragranceType')} placeholder="Ex: Eau de Parfum" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="keyNotes">Notas Chave</Label>
              <Input id="keyNotes" {...register('keyNotes')} placeholder="Ex: Bergamota, Lavanda, Vetiver" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="targetAudience">Público Alvo</Label>
              <Input id="targetAudience" {...register('targetAudience')} placeholder="Ex: Homem moderno" />
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description">Descrição do Produto</Label>
            <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isPending} className="gap-2 rounded-full">
              <Sparkles className={cn("size-4", isPending && "animate-spin")} />
              {isPending ? 'Gerando...' : 'Gerar com IA'}
            </Button>
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
        <Button type="submit" className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-yellow-400">
          Salvar Produto
        </Button>
      </div>
    </form>
  );
}
