import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, LogIn, Lock, Eye, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageById } from '@/lib/placeholder-images';
import { LogoIcon } from '@/components/icons/logo-icon';

export default function AdminLoginPage() {
  const bgImage = getImageById('login-bg');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden font-display">
      {bgImage && (
        <div className="absolute inset-0 z-0 h-full w-full">
          <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm"></div>
          <Image
            src={bgImage.imageUrl}
            alt={bgImage.description}
            fill
            className="object-cover"
            data-ai-hint={bgImage.imageHint}
            priority
          />
        </div>
      )}

      <div className="relative z-20 flex w-full flex-col items-center p-4">
        <div className="w-full max-w-[480px] overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all dark:bg-[#2c2b18] dark:shadow-black/20">
          <div className="flex flex-col items-center border-b border-border px-8 pt-10 pb-6">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/20 text-foreground dark:text-primary">
              <LogoIcon className="size-8" />
            </div>
            <h1 className="font-headline text-center text-[28px] font-bold leading-tight tracking-tight text-foreground">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-center text-base text-muted-foreground">
              Login Admin - Acesso Restrito
            </p>
          </div>

          <div className="px-8 py-8">
            <form action="/admin/products" method="GET" className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-bold leading-normal text-foreground"
                >
                  E-mail ou Usuário
                </Label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-muted-foreground" />
                  <Input
                    id="email"
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
                  htmlFor="password"
                  className="font-bold leading-normal text-foreground"
                >
                  Senha
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-muted-foreground" />
                  <Input
                    id="password"
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

          <div className="border-t border-border bg-muted/50 py-4 text-center dark:bg-background/50">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
            >
              <ArrowLeft className="size-[18px]" />
              Voltar para a Loja
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-foreground/50 dark:text-foreground/30">
          © {new Date().getFullYear()} Perfumes & Decantes. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
