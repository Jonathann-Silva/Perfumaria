'use client';
import { useState, use } from 'react';
import { Header } from '@/components/layout/header';
import {
  ChevronRight,
  Maximize,
  ShoppingBag,
  Heart,
  Sprout,
  Cloud,
  TreePine,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';
import { getImageById } from '@/lib/placeholder-images';
import { cn, formatCurrency } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';


const galleryImages = [
  'details-main',
  'details-thumb-1',
  'details-thumb-2',
  'details-thumb-3',
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [activeImageId, setActiveImageId] = useState(galleryImages[0]);
  const activeImage = getImageById(activeImageId);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();

  const productRef = firestore ? doc(firestore, 'products', params.id) : null;
  const { data: product, loading } = useDoc<Product>(productRef);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast({
      title: "Adicionado ao Carrinho!",
      description: `${quantity}x ${product.name} foi adicionado ao seu carrinho.`,
    });
  }

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  if (!product) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
            <h1 className="text-2xl font-bold">Produto não encontrado</h1>
            <p className="text-muted-foreground">O produto que você está procurando não existe ou foi removido.</p>
            <Button asChild className="mt-4">
                <Link href="/products">Voltar para a Loja</Link>
            </Button>
        </div>
    )
  }


  return (
    <div className="bg-background font-display text-foreground antialiased">
      <Header />
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-10 md:py-10">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>
          <ChevronRight className="size-4 text-muted-foreground" />
          <Link
            href="/products"
            className="font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Perfumes
          </Link>
          <ChevronRight className="size-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4">
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-card shadow-sm dark:bg-stone-800 sm:aspect-square lg:aspect-[4/3]">
                {activeImage && (
                  <Image
                    src={activeImage.imageUrl}
                    alt={activeImage.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    data-ai-hint={activeImage.imageHint}
                  />
                )}
                <Button
                  size="icon"
                  className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-foreground backdrop-blur-sm hover:bg-primary hover:text-primary-foreground dark:bg-black/50"
                >
                  <Maximize />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((id, index) => {
                  const thumb = getImageById(id);
                  if (!thumb) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveImageId(id)}
                      className={cn(
                        'aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-colors',
                        activeImageId === id
                          ? 'border-primary'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={thumb.imageUrl}
                        alt={thumb.description}
                        width={200}
                        height={200}
                        className="size-full object-cover"
                        data-ai-hint={thumb.imageHint}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="border-b pb-6">
              <a
                href="#"
                className="mb-2 block text-sm font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary hover:underline"
              >
                {product.brand}
              </a>
              <h1 className="font-headline text-4xl font-bold leading-[1.1] text-foreground md:text-5xl">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-3xl font-bold text-foreground">
                  {formatCurrency(product.price)}
                </span>
                <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-green-800">
                  Em Estoque
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {product.description || 'Uma fragrância sedutora que combina notas amadeiradas profundas com um toque cítrico vibrante. Perfeito para o homem moderno que deixa sua marca por onde passa.'}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Quantidade
              </span>
              <div className="flex items-center gap-2 rounded-full border bg-card p-1">
                  <Button size="icon" variant="ghost" className="size-8 rounded-full" onClick={() => setQuantity(q => Math.max(1, q-1))}>
                      <Minus className="size-4"/>
                  </Button>
                  <span className="w-6 text-center font-bold">{quantity}</span>
                  <Button size="icon" variant="ghost" className="size-8 rounded-full" onClick={() => setQuantity(q => q+1)}>
                      <Plus className="size-4"/>
                  </Button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
               <Button
                onClick={handleAddToCart}
                className="h-14 flex-1 gap-2 rounded-full font-bold text-lg text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                <ShoppingBag />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="group size-14 rounded-full border-border bg-card text-foreground transition-all hover:text-red-500"
              >
                <Heart className="group-hover:fill-current" />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border bg-card p-6 dark:bg-stone-800">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Pirâmide Olfativa
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-background text-primary">
                    <Sprout />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-muted-foreground">Topo</span>
                    <span className="text-sm font-medium text-foreground">Bergamota</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-background text-primary">
                    <Cloud />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-muted-foreground">Coração</span>
                    <span className="text-sm font-medium text-foreground">Lavanda</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-background text-primary">
                    <TreePine />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-muted-foreground">Fundo</span>
                    <span className="text-sm font-medium text-foreground">Vetiver</span>
                  </div>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base font-bold text-foreground hover:text-primary">
                  Descrição Detalhada
                </AccordionTrigger>
                <AccordionContent>
                  O {product.name} é uma obra-prima da perfumaria moderna. Criado para evocar a sensação de liberdade e sofisticação, ele abre com notas cítricas frescas que energizam, evoluindo para um coração aromático e finalizando com uma base amadeirada que perdura por horas na pele.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base font-bold text-foreground hover:text-primary">
                  Ingredientes
                </AccordionTrigger>
                <AccordionContent>
                  Alcohol Denat, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Coumarin, Citral, Geraniol.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base font-bold text-foreground hover:text-primary">
                  Envio e Devoluções
                </AccordionTrigger>
                <AccordionContent>
                  Frete grátis para compras acima de R$ 300,00. Aceitamos devoluções de produtos não abertos dentro de 30 dias após a compra.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
