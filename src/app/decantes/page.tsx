import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/shared/product-card';
import { products } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListFilter, Beaker } from 'lucide-react';

export default function DecantesPage() {
  const decantProducts = products.filter((p) => p.type === 'decant');
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-10">
        <section>
          <div className="mb-8 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-card p-6 shadow-sm dark:bg-card-dark md:flex-row md:items-center lg:p-12">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:size-16">
                <Beaker className="size-6 lg:size-8" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-headline text-3xl font-black leading-[1.1] tracking-tight text-foreground lg:text-4xl">
                  Decantes
                </h1>
                <p className="text-base text-muted-foreground lg:text-lg">
                  Experimente fragrâncias de luxo em frações.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ListFilter className="size-5 text-muted-foreground" />
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px] rounded-full font-medium">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price-asc">
                    Preço: Menor para Maior
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Preço: Maior para Menor
                  </SelectItem>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {decantProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
