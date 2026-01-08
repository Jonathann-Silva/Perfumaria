'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, LogIn, Lock, Eye, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageById } from '@/lib/placeholder-images';
import { LogoIcon } from '@/components/icons/logo-icon';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

export default function CheckoutLoginPage() {
  const bgImage = getImageById('login-bg');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'O serviço de autenticação não está disponível.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (authView === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast({
          title: 'Conta Criada!',
          description: 'Sua conta foi criada com sucesso. Redirecionando...',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login bem-sucedido!',
          description: 'Bem-vindo de volta. Redirecionando...',
        });
      }
      // Após login ou cadastro, redireciona para a página de endereço do checkout
      router.push('/checkout/address');

    } catch (error: any) {
      console.error(error);
      const errorCode = error.code;
      let message = 'Ocorreu um erro. Tente novamente.';
      if (errorCode === 'auth/email-already-in-use') {
        message = 'Este e-mail já está sendo usado por outra conta.';
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found') {
        message = 'E-mail ou senha incorretos.';
      } else if (errorCode === 'auth/invalid-email') {
        message = 'O formato do e-mail é inválido.';
      }
      toast({
        variant: 'destructive',
        title: 'Falha na autenticação',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {authView === 'login' ? 'Acesse sua Conta' : 'Crie sua Conta'}
            </h1>
            <p className="mt-2 text-center text-base text-muted-foreground">
              Para prosseguir com a compra, você precisa se identificar.
            </p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleAuth} className="flex flex-col gap-5">
              {authView === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold leading-normal text-foreground">Nome Completo</Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-14 w-full rounded-xl border-border bg-muted/50 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background dark:focus:bg-background"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold leading-normal text-foreground">E-mail</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-xl border-border bg-muted/50 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background dark:focus:bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold leading-normal text-foreground">Senha</Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-xl border-border bg-muted/50 pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background dark:focus:bg-background"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 size-10 rounded-full text-muted-foreground hover:bg-muted/80" aria-label="Show password">
                    <Eye />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 h-12 w-full rounded-full bg-primary text-sm font-bold leading-normal tracking-[0.015em] text-primary-foreground shadow-sm transition-all active:scale-[0.98] hover:brightness-95 focus:ring-4 focus:ring-primary/30"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Processando...' : authView === 'login' ? 'Entrar e Continuar' : 'Criar Conta e Continuar'}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                {authView === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <Button
                  type="button"
                  variant="link"
                  className="p-1 font-bold text-primary hover:underline"
                  onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')}
                >
                  {authView === 'login' ? 'Crie uma agora' : 'Faça login'}
                </Button>
              </p>
            </form>
          </div>

          <div className="border-t border-border bg-muted/50 py-4 text-center dark:bg-background/50">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
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
