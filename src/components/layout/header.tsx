'use client';

import {
  Menu,
  Search,
  ShoppingBag,
  Sprout,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md dark:bg-background-dark/90">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center text-primary">
                <Sprout className="size-8" />
              </div>
              <h2 className="hidden text-lg font-bold tracking-tight text-foreground md:block">
                Perfumes & Decantes
              </h2>
            </Link>
          </div>

          {!isMobile && (
            <div className="mx-8 hidden flex-1 max-w-md md:flex">
              <label className="relative flex w-full items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <Search className="size-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar perfumes, marcas ou notas..."
                  className="h-11 w-full rounded-full border-none bg-background py-2 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary dark:bg-white/10"
                />
              </label>
            </div>
          )}

          <div className="flex items-center gap-4 lg:gap-6">
            <nav className="hidden items-center gap-6 lg:flex">
              <Link
                href="/"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Início
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Perfumes
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Decantes
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Marcas
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button className="hidden h-10 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 sm:flex">
                Login
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background hover:bg-muted dark:bg-white/10 dark:hover:bg-white/20"
              >
                <User className="size-5 text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="group relative rounded-full bg-background hover:bg-muted dark:bg-white/10 dark:hover:bg-white/20"
              >
                <ShoppingBag className="size-5 text-foreground transition-colors group-hover:text-primary" />
                <span className="absolute right-0 top-0 size-2.5 rounded-full border-2 border-card bg-red-500 dark:border-background-dark"></span>
              </Button>

              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background dark:bg-white/10 lg:hidden"
                  >
                    <Menu className="size-5 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col gap-6 p-6">
                    <Link
                      href="/"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Início
                    </Link>
                    <Link
                      href="/products"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Perfumes
                    </Link>
                    <Link
                      href="/products"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Decantes
                    </Link>
                    <Link
                      href="#"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Marcas
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="mt-3 pb-2 md:hidden">
            <label className="relative flex w-full items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <Search className="size-5" />
              </div>
              <Input
                type="text"
                placeholder="Buscar..."
                className="h-10 w-full rounded-full border-none bg-muted py-2 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary dark:bg-white/10"
              />
            </label>
          </div>
        )}
      </div>
    </header>
  );
}
