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
  LogOut,
  ChevronDown,
  Loader2,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { LogoIcon } from '../icons/logo-icon';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const isMobile = useIsMobile();
  const { cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  
  // States for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Firebase hooks
  const auth = useAuth();
  const { user } = useUser();


  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      toast({
        title: 'Você saiu!',
        description: 'Até a próxima!',
      });
      router.push('/');
    }
  };

  const handleCustomerAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Erro de Configuração',
        description: 'O sistema de autenticação não está disponível.',
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
          description: 'Sua conta foi criada com sucesso.',
        });
        setAuthDialogOpen(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login bem-sucedido!',
          description: 'Bem-vindo de volta.',
        });
        setAuthDialogOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      const errorCode = error.code;
      let message = 'Ocorreu um erro. Tente novamente.';
      if (errorCode === 'auth/email-already-in-use') {
        message = 'Este e-mail já está sendo usado por outra conta.';
      } else if (errorCode === 'auth/wrong-password') {
        message = 'E-mail ou senha incorretos.';
      } else if (errorCode === 'auth/invalid-email') {
        message = 'O formato do e-mail é inválido.';
      } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        message = 'E-mail ou senha incorretos.';
      }
      toast({
        variant: 'destructive',
        title: 'Falha na autenticação',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.email === 'admin@gmail.com') {
        toast({
          title: 'Login bem-sucedido!',
          description: 'Bem-vindo ao painel de administração.',
        });
        router.push('/admin');
      } else {
        await signOut(auth);
        toast({
          variant: 'destructive',
          title: 'Acesso Negado',
          description: 'Este usuário não tem permissão de administrador.',
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: 'E-mail ou senha incorretos. Verifique suas credenciais.',
      });
    } finally {
      setIsSubmitting(false);
       setEmail('');
      setPassword('');
    }
  };


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
                href="/perfumes"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Perfumes
              </Link>
              <Link
                href="/decantes"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Decantes
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Todos Produtos
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="hidden h-10 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 sm:flex">
                    Login Admin
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
                      onSubmit={handleAdminLogin}
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
                            type="email"
                            placeholder="admin@gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 h-12 w-full rounded-full bg-primary text-sm font-bold leading-normal tracking-[0.015em] text-primary-foreground shadow-sm transition-all active:scale-[0.98] hover:brightness-95 focus:ring-4 focus:ring-primary/30"
                      >
                         {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LogIn className="mr-2 size-5" />
                        )}
                        {isSubmitting ? 'Verificando...' : 'Entrar'}
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
             
              {user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                       <Avatar>
                         <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Avatar'} />
                         <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                       </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'Usuário'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Minha Conta</DropdownMenuItem>
                    <DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog open={isAuthDialogOpen} onOpenChange={(open) => {
                  setAuthDialogOpen(open);
                  if (!open) {
                    setAuthView('login');
                    setEmail('');
                    setPassword('');
                    setName('');
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-background hover:bg-muted dark:bg-white/10 dark:hover:bg-white/20"
                    >
                      <User className="size-5 text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[420px] p-0">
                    <DialogHeader className="flex flex-col items-center border-b border-border px-8 pt-10 pb-6 text-center">
                      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/20 text-foreground dark:text-primary">
                        <LogoIcon className="size-8" />
                      </div>
                      <DialogTitle className="font-headline text-center text-[28px] font-bold leading-tight tracking-tight text-foreground">
                        {authView === 'login' ? 'Acesse sua Conta' : 'Crie sua Conta'}
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-center text-base text-muted-foreground">
                        {authView === 'login'
                          ? 'Entre ou crie sua conta para uma experiência completa.'
                          : 'Preencha os campos para criar sua conta.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="px-8 py-8">
                      <form
                        onSubmit={handleCustomerAuth}
                        className="flex flex-col gap-5"
                      >
                        {authView === 'register' && (
                          <div className="space-y-2">
                            <Label
                              htmlFor="customer-name-modal"
                              className="font-bold leading-normal text-foreground"
                            >
                              Nome Completo
                            </Label>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 text-muted-foreground" />
                              <Input
                                id="customer-name-modal"
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
                          <Label
                            htmlFor="customer-email-modal"
                            className="font-bold leading-normal text-foreground"
                          >
                            E-mail
                          </Label>
                          <div className="relative flex items-center">
                            <User className="absolute left-4 text-muted-foreground" />
                            <Input
                              id="customer-email-modal"
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
                          <Label
                            htmlFor="customer-password-modal"
                            className="font-bold leading-normal text-foreground"
                          >
                            Senha
                          </Label>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 text-muted-foreground" />
                            <Input
                              id="customer-password-modal"
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-14 w-full rounded-xl border-border bg-muted/50 pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background dark:focus:bg-background"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="mt-4 h-12 w-full rounded-full bg-primary text-sm font-bold leading-normal tracking-[0.015em] text-primary-foreground shadow-sm transition-all active:scale-[0.98] hover:brightness-95 focus:ring-4 focus:ring-primary/30"
                        >
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {authView === 'login' ? 'Entrar' : 'Criar Conta'}
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
                  </DialogContent>
                </Dialog>
              )}


              <Button
                variant="ghost"
                size="icon"
                className="group relative rounded-full bg-background hover:bg-muted dark:bg-white/10 dark:hover:bg-white/20"
                asChild
              >
                <Link href="/checkout/address">
                  <ShoppingBag className="size-5 text-foreground transition-colors group-hover:text-primary" />
                  {cartCount > 0 && (
                    <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border-2 border-card bg-red-500 text-[10px] font-bold text-white dark:border-background-dark">
                      {cartCount}
                    </span>
                  )}
                </Link>
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
                      href="/perfumes"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Perfumes
                    </Link>
                    <Link
                      href="/decantes"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Decantes
                    </Link>
                    <Link
                      href="/products"
                      className="text-lg font-medium"
                      onClick={() => setSheetOpen(false)}
                    >
                      Todos Produtos
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

    