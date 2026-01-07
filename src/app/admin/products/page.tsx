'use client';

import { useState } from 'react';
import {
  Download,
  Plus,
  Filter,
  Search,
  Package,
  AlertTriangle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getImageById } from '@/lib/placeholder-images';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ProductForm } from './_components/product-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function RecentAddItem({
  product,
  onEdit,
}: {
  product: Product;
  onEdit: (product: Product) => void;
}) {
  const image = getImageById(product.imageId);
  return (
    <div
      onClick={() => onEdit(product)}
      className="group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 dark:hover:bg-neutral-800/50"
    >
      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted dark:bg-neutral-800">
        {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={48}
            height={48}
            className="size-full object-cover"
            data-ai-hint={image.imageHint}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {product.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(product.price)}
        </p>
      </div>
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <Edit className="size-4 text-muted-foreground hover:text-primary" />
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
}: {
  product: Product;
  onEdit: (product: Product) => void;
}) {
  const image = getImageById(product.imageId);
  const statusConfig = {
    'in-stock': {
      label: `Em Estoque (${product.stock})`,
      color:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dot: 'bg-green-500',
    },
    'low-stock': {
      label: `Baixo (${product.stock})`,
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      dot: 'bg-yellow-500',
    },
    'out-of-stock': {
      label: 'Esgotado',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      dot: 'bg-red-500',
    },
  };
  const currentStatus = statusConfig[product.status];

  return (
    <TableRow className="transition-colors hover:bg-muted/50">
      <TableCell className="p-4">
        <div className="flex items-center gap-3">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={40}
              height={40}
              className="size-10 rounded-lg object-cover bg-muted"
              data-ai-hint={image.imageHint}
            />
          )}
          <span className="text-sm font-medium text-foreground">
            {product.name}
          </span>
        </div>
      </TableCell>
      <td className="p-4 text-sm text-muted-foreground">{product.brand}</td>
      <td className="p-4 text-sm text-muted-foreground">
        <Badge variant="secondary" className="text-xs">
          {product.category}
        </Badge>
      </td>
      <td className="p-4 text-sm font-medium text-foreground">
        {formatCurrency(product.price)}
      </td>
      <td className="p-4">
        <Badge
          className={`gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${currentStatus.color}`}
        >
          <span
            className={`size-1.5 rounded-full ${currentStatus.dot}`}
          ></span>
          {currentStatus.label}
        </Badge>
      </td>
      <td className="p-4 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          onClick={() => onEdit(product)}
        >
          <Edit className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-5" />
        </Button>
      </td>
    </TableRow>
  );
}

export default function AdminProductsPage() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const formTitle = editingProduct
    ? 'Editar Produto'
    : 'Novo Cadastro de Produto';

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-headline text-4xl font-black leading-tight tracking-tight text-foreground">
            Catálogo de Perfumes
          </h1>
          <p className="text-lg text-muted-foreground">
            Adicione novos perfumes à coleção ou gerencie o estoque existente.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-border px-5 py-3 font-medium"
          >
            <Download className="size-5" />
            <span>Exportar</span>
          </Button>
          <Button
            onClick={handleNewProduct}
            className="gap-2 rounded-full bg-foreground px-6 py-3 font-bold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-black"
          >
            <Plus className="size-5" />
            <span>Novo Item</span>
          </Button>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <FileEdit className="text-primary" />
              {formTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto p-6 pt-0">
            <ProductForm
              product={editingProduct}
              onSave={handleFormClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm dark:bg-[#1a190b]">
            <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Gerenciar Estoque
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar produto..."
                    className="w-full rounded-full border-border bg-muted/60 pl-10 pr-4 text-sm transition-all focus:bg-card dark:bg-neutral-900 sm:w-64"
                  />
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Filter />
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 dark:bg-neutral-900/20">
                    <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Produto
                    </TableHead>
                    <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Marca
                    </TableHead>
                    <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Categoria
                    </TableHead>
                    <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Preço
                    </TableHead>
                    <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="p-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {products.map(
                    (p) =>
                      p.id !== '4' && (
                        <ProductRow
                          key={p.id}
                          product={p}
                          onEdit={handleEditProduct}
                        />
                      )
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <span className="text-sm text-muted-foreground">
                Mostrando 1-3 de 1,240
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full" disabled>
                  <ChevronLeft />
                </Button>
                <Button size="icon" className="rounded-full">
                  1
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  2
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  3
                </Button>
                <span className="flex items-center justify-center text-muted-foreground">
                  ...
                </span>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 xl:col-span-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-5 shadow-sm dark:bg-[#1a190b]">
              <Package className="text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">1,240</p>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Total Produtos
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-5 shadow-sm dark:bg-[#1a190b]">
              <AlertTriangle className="text-orange-500" />
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Estoque Baixo
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-lg border bg-card shadow-sm dark:bg-[#1a190b]">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Recentes
              </h2>
              <a
                href="#"
                className="text-xs font-bold text-primary hover:underline"
              >
                Ver Todos
              </a>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1">
                {products
                  .slice(4, 7)
                  .map((p) => (
                    <RecentAddItem
                      key={p.id}
                      product={p}
                      onEdit={handleEditProduct}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
