import { Sprout, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pt-16 pb-8 dark:bg-black/20">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="mb-12 flex flex-col justify-between gap-12 lg:flex-row">
          <div className="flex max-w-sm flex-col">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center text-primary">
                <Sprout className="size-6" />
              </div>
              <h3 className="font-headline text-xl font-bold">
                Perfumes & Decantes
              </h3>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Sua jornada olfativa começa aqui. Trabalhamos apenas com produtos
              originais e garantimos a melhor experiência de compra.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-white/10"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">IG</span>
              </Link>
              <Link
                href="#"
                className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-white/10"
                aria-label="TikTok"
              >
                <span className="text-xs font-bold">TT</span>
              </Link>
              <Link
                href="#"
                className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-white/10"
                aria-label="YouTube"
              >
                <span className="text-xs font-bold">YT</span>
              </Link>
            </div>
          </div>
          <div className="max-w-md flex-1">
            <h4 className="font-headline font-bold">
              Inscreva-se na nossa Newsletter
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Receba novidades, cupons exclusivos e dicas de perfumaria
              diretamente no seu e-mail.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="h-12 flex-1 rounded-full border-none bg-muted px-6 focus:ring-2 focus:ring-primary dark:bg-white/10"
              />
              <Button
                type="submit"
                size="icon"
                className="size-12 rounded-full font-bold text-primary-foreground"
              >
                <ArrowRight className="size-5" />
              </Button>
            </form>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Perfumes e Decantes. Todos os direitos reservados.</p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <Link
              href="#"
              className="transition-colors hover:text-primary"
            >
              Política de Privacidade
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-primary"
            >
              Termos de Uso
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-primary"
            >
              Trocas e Devoluções
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
