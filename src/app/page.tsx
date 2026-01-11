'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  BadgeCheck,
  Truck,
  FlaskConical,
  Banknote,
  Globe,
  Star,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/shared/product-card';
import { categories } from '@/lib/data-static';
import {
  getImageById,
} from '@/lib/placeholder-images';
import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { ChatComponent } from '@/components/chat/ChatComponent';

export default function Home() {
  const heroImage = getImageById('hero');
  const firestore = useFirestore();

  const productsRef = useMemo(() => 
    firestore ? query(collection(firestore, "products"), orderBy("name", "desc"), limit(4)) : null, 
    [firestore]
  );
  const { data: products, loading } = useCollection<Product>(productsRef);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-10">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="flex flex-col-reverse items-center gap-8 rounded-[2rem] bg-card p-6 shadow-sm dark:bg-card-dark lg:flex-row lg:gap-16 lg:p-12">
            <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-2 bg-primary/20 text-xs font-bold uppercase tracking-wider text-primary-foreground dark:text-primary"
              >
                <span className="size-2 animate-pulse rounded-full bg-primary"></span>
                Novidade Exclusiva
              </Badge>
              <h1 className="font-headline text-4xl font-black leading-[1.1] tracking-tight lg:text-6xl">
                Descubra sua <br />
                <span className="bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
                  Assinatura Olfativa
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Explore nossa seleção curada de perfumes importados e decantes
                exclusivos. O luxo acessível em cada gota.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  asChild
                >
                  <Link href="/products">Ver Coleção</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-border bg-card px-8 font-bold text-foreground transition-all hover:bg-accent/50"
                >
                  Sobre Decantes
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-6 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BadgeCheck className="size-[18px]" /> 100% Original
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="size-[18px]" /> Frete Grátis*
                </div>
              </div>
            </div>
            <div className="group relative aspect-square w-full overflow-hidden rounded-[2rem] lg:w-1/2 lg:aspect-[4/3]">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/20 to-transparent"></div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              )}
            </div>
          </div>
        </section>

        {/* Categorias Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between px-2">
            <h2 className="font-headline text-2xl font-bold tracking-tight">
              Categorias Populares
            </h2>
            <Link
              href="#"
              className="text-sm font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary"
            >
              Ver todas
            </Link>
          </div>
          <div className="relative">
            <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-4">
              {categories.map((category) => {
                const categoryImage = getImageById(category.imageId);
                return (
                  <Link
                    key={category.id}
                    href="#"
                    className="group/item snap-start"
                  >
                    <div className="flex min-w-[100px] flex-col items-center gap-3">
                      <div className="size-24 rounded-full border-2 border-transparent p-1 transition-all group-hover/item:border-primary">
                        <div className="relative size-full overflow-hidden rounded-full">
                          {categoryImage ? (
                            <Image
                              src={categoryImage.imageUrl}
                              alt={categoryImage.description}
                              fill
                              className="object-cover transition-transform group-hover/item:scale-110"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center rounded-full bg-primary/20 transition-colors group-hover/item:bg-primary/40">
                              <Star className="text-3xl text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="mb-16 rounded-xl border border-border bg-card p-8 dark:bg-card-dark">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FlaskConical />
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold">O que é um Decante?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Uma fração do perfume original transferida para um frasco menor. Ideal para testar.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground dark:bg-white/10">
                <Banknote />
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold">Economia Inteligente</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tenha acesso a perfumes de luxo por uma fração do preço do frasco grande.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground dark:bg-white/10">
                <Globe />
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold">Perfeito para Viagem</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tamanho compacto e seguro para levar sua fragrância favorita onde for.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel de Produtos */}
        <section className="mb-12">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <div className="mb-8 flex items-center justify-between px-2">
              <h2 className="font-headline text-2xl font-bold tracking-tight">
                Destaques da Semana
              </h2>
              <div className="flex gap-2">
                <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
                <CarouselNext className="relative right-0 top-0 translate-y-0" />
              </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="animate-spin text-primary" size={32}/>
                </div>
            ) : (
                <CarouselContent className="-ml-6">
                {products?.map((product) => (
                    <CarouselItem
                    key={product.id}
                    className="pl-6 sm:basis-1/2 lg:basis-1/4"
                    >
                    <ProductCard product={product} />
                    </CarouselItem>
                ))}
                </CarouselContent>
            )}
          </Carousel>
        </section>
      </main>

      <Footer />
      <ChatComponent />
    </div>
  );
}
