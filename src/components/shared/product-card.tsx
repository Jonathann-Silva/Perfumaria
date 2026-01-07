import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getImageById } from '@/lib/placeholder-images';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productImage = getImageById(product.imageId);

  return (
    <div className="group relative rounded-[1.5rem] border border-transparent bg-card p-3 transition-all duration-300 hover:shadow-xl dark:bg-card-dark dark:hover:border-white/5">
      <div className="absolute right-5 top-5 z-10">
        <Button
          size="icon"
          className="size-8 rounded-full border-none bg-white/80 text-muted-foreground shadow-none backdrop-blur-sm hover:text-red-500 dark:bg-black/50"
        >
          <Heart className="size-[18px]" />
          <span className="sr-only">Adicionar aos favoritos</span>
        </Button>
      </div>
      <Link href={`/products/${product.id}`}>
        <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted dark:bg-white/5">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={productImage.description}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={productImage.imageHint}
            />
          )}

          <Badge
            className={cn(
              'absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wide',
              product.type === 'decant'
                ? 'bg-primary text-primary-foreground'
                : 'bg-black/60 text-white backdrop-blur-sm'
            )}
          >
            {product.type === 'decant'
              ? `Decante ${product.decantMl}ml`
              : 'Lacrado'}
          </Badge>
        </div>
      </Link>
      <div className="px-2 pb-2">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-headline text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
            <span className="text-xl font-bold">
              {formatCurrency(product.price)}
            </span>
          </div>
          <Button
            size="icon"
            variant={product.type === 'decant' ? 'ghost' : 'default'}
            className={cn(
              'size-10 rounded-full',
              product.type === 'decant' && 'bg-muted dark:bg-white/10 hover:bg-primary hover:text-primary-foreground',
              product.type !== 'decant' && 'shadow-lg shadow-primary/20'
            )}
            asChild
          >
           <Link href="/checkout">
              <ShoppingCart className="size-5" />
              <span className="sr-only">Adicionar ao carrinho</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

    