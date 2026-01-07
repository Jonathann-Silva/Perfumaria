'use client';

import {
  Menu,
  Search,
  ShoppingBag,
  Sprout,
  User,
  LogIn,
  Lock,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { LogoIcon } from '../icons/logo-icon';

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="hidden h-10 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 sm:flex">
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[480px] p-0">
                  <DialogHeader className="flex flex-col items-center border-b border-border px-8 pt-10 pb-6 text-center">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/20 text-foreground dark:text-primary">
                      <LogoIcon className="size-8" />
                    </div>
                    <DialogTitle className="font-headline text-center text-[28px] font-bold leading-tight tracking-tight text-foreground">
                      Bem-vindo de volta
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-center text-base text-muted-foreground">
                      Login Admin - Acesso Restrito
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-8 py-8">
                    <form
                      action="/admin/products"
                      method="GET"
                      className="flex flex-col gap-5"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="email-modal"
                          className="font-bold leading-normal text-foreground"
                        >
                          E-mail ou Usuário
                        </Label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 text-muted-foreground" />
                          <Input
                            id="email-modal"
                            name="email"
                            type="text"
                            placeholder="admin@exemplo.com"
                            required
                            className="h-14 w-full rounded-xl border-border bg-muted/50 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background dark:focus:bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password-modal"
                          className="font-bold leading-normal text-foreground"
                        >
                          Senha
                        </Label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-4 text-muted-foreground" />
                          <Input
                            id="password-modal"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="h-14 w-full rounded-xl border-border bg-muted/50 pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background dark:focus:bg-background"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 size-10 rounded-full text-muted-foreground hover:bg-muted/80"
                            aria-label="Show password"
                          >
                            <Eye />
                          </Button>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Link
                            href="#"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          >
                            Esqueci minha senha
                          </Link>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="mt-4 h-12 w-full rounded-full bg-primary text-sm font-bold leading-normal tracking-[0.015em] text-primary-foreground shadow-sm transition-all active:scale-[0.98] hover:brightness-95 focus:ring-4 focus:ring-primary/30"
                      >
                        <LogIn className="mr-2 size-5" />
                        Entrar
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <SheetTitle className="sr-only">Menu</SheetTitle>
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
