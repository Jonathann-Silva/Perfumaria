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
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '../ui/separator';

export function Header() {
  const [isMenuSheetOpen, setMenuSheetOpen] = useState(false);
  const [isCartSheetOpen, setCartSheetOpen] = useState(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [isAdminAuthDialogOpen, setAdminAuthDialogOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const isMobile = useIsMobile();
  const { cartCount, cartItems, cartSubtotal, removeFromCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  
  // States for customer auth form
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // States for admin auth form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

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
        const userCredential = await createUserWithEmailAndPassword(auth, customerEmail, customerPassword);
        await updateProfile(userCredential.user, { displayName: customerName });
        toast({
          title: 'Conta Criada!',
          description: 'Sua conta foi criada com sucesso.',
        });
        setAuthDialogOpen(false);
      } else {
        await signInWithEmailAndPassword(auth, customerEmail, customerPassword);
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

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !adminEmail) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'O serviço de autenticação não está disponível ou o e-mail está em branco.',
      });
      return;
    }
    
    setIsSubmitting(true);

    const loginAndRedirect = async () => {
      setAdminAuthDialogOpen(false);
      router.push('/admin');
    }
    
    try {
      // Tenta fazer login primeiro
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      if (userCredential.user.email === 'admin@gmail.com') {
        toast({ title: 'Login bem-sucedido!', description: 'Bem-vindo ao painel de administração.' });
        await loginAndRedirect();
      } else {
        await signOut(auth);
        toast({ variant: 'destructive', title: 'Acesso Negado', description: 'Este usuário não tem permissão de administrador.' });
      }
    } catch (error: any) {
      // Se o erro for 'invalid-credential' (usuário não existe ou senha errada), tenta criar o usuário admin
      if (error.code === 'auth/invalid-credential' && adminEmail === 'admin@gmail.com') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
          await updateProfile(newUserCredential.user, { displayName: 'Admin' });
          toast({ title: 'Conta de Admin Criada!', description: 'Bem-vindo ao painel de administração.' });
          await loginAndRedirect();
        } catch (creationError: any) {
          toast({ variant: 'destructive', title: 'Falha na Criação do Admin', description: creationError.message });
        }
      } else {
        // Outros erros de login
        toast({ variant: 'destructive', title: 'Falha no Login', description: 'E-mail ou senha incorretos. Verifique suas credenciais.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = () => {
    setCartSheetOpen(false);
    if (user) {
      router.push('/checkout/address');
    } else {
      router.push('/checkout/login');
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
                Luxo & Aroma
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
               <Dialog open={isAdminAuthDialogOpen} onOpenChange={(open) => {
                  if (!open) {
                    setAdminEmail('');
                    setAdminPassword('');
                  }
                  setAdminAuthDialogOpen(open);
                }}>
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
                    <DialogTitle className="font-headline text-center text-2xl font-bold leading-tight tracking-tight text-foreground">
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
                          E-mail de Administrador
                        </Label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 text-muted-foreground" />
                          <Input
                            id="email-modal"
                            name="email"
                            type="email"
                            placeholder="admin@gmail.com"
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
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
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
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
                  if (!open) {
                    setAuthView('login');
                    setCustomerEmail('');
                    setCustomerPassword('');
                    setCustomerName('');
                  }
                  setAuthDialogOpen(open);
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
                      <DialogTitle className="font-headline text-center text-2xl font-bold leading-tight tracking-tight text-foreground">
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
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
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
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
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
                              value={customerPassword}
                              onChange={(e) => setCustomerPassword(e.target.value)}
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


               <Sheet open={isCartSheetOpen} onOpenChange={setCartSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="group relative rounded-full bg-background hover:bg-muted dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    <ShoppingBag className="size-5 text-foreground transition-colors group-hover:text-primary" />
                    {cartCount > 0 && (
                      <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border-2 border-card bg-red-500 text-[10px] font-bold text-white dark:border-background-dark">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                  <SheetHeader className="px-6">
                    <SheetTitle>Carrinho ({cartCount})</SheetTitle>
                  </SheetHeader>
                  <Separator />
                  {cartItems.length > 0 ? (
                    <>
                      <div className="flex-1 overflow-y-auto px-6">
                        <div className="flex flex-col gap-6">
                          {cartItems.map((item) => {
                             return (
                                <div key={item.id} className="flex items-center gap-4">
                                   <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                                     {item.imageUrl && (
                                       <Image
                                         src={item.imageUrl}
                                         alt={item.name}
                                         fill
                                         className="object-cover"
                                       />
                                     )}
                                   </div>
                                   <div className="flex flex-1 flex-col gap-1">
                                      <h3 className="font-bold">{item.name}</h3>
                                      <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                                   </div>
                                   <Button variant="ghost" size="icon" className="group -mr-2 h-8 w-8 rounded-full" onClick={() => removeFromCart(item.id)}>
                                     <X className="size-4 text-muted-foreground transition-colors group-hover:text-red-500" />
                                   </Button>
                                </div>
                             )
                          })}
                        </div>
                      </div>
                      <SheetFooter className="mt-auto flex-col gap-4 border-t bg-background p-6">
                         <div className="flex justify-between font-bold">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cartSubtotal)}</span>
                         </div>
                         <Button onClick={handleCheckout} className="w-full rounded-full">
                           Finalizar Compra
                         </Button>
                      </SheetFooter>
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                       <ShoppingBag className="size-16 text-muted-foreground" />
                       <h3 className="text-xl font-bold">Seu carrinho está vazio</h3>
                       <p className="text-sm text-muted-foreground">Adicione alguns perfumes para começar.</p>
                       <Button asChild className="rounded-full" onClick={() => setCartSheetOpen(false)}>
                          <Link href="/products">Explorar Perfumes</Link>
                       </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              <Sheet open={isMenuSheetOpen} onOpenChange={setMenuSheetOpen}>
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
                      onClick={() => setMenuSheetOpen(false)}
                    >
                      Início
                    </Link>
                    <Link
                      href="/perfumes"
                      className="text-lg font-medium"
                      onClick={() => setMenuSheetOpen(false)}
                    >
                      Perfumes
                    </Link>
                    <Link
                      href="/decantes"
                      className="text-lg font-medium"
                      onClick={() => setMenuSheetOpen(false)}
                    >
                      Decantes
                    </Link>
                    <Link
                      href="/products"
                      className="text-lg font-medium"
                      onClick={() => setMenuSheetOpen(false)}
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
