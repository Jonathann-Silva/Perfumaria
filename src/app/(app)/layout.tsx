
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { EngrenAppLogo } from '@/components/icons';
import { AuthProvider, useAuth } from '@/components/auth-provider';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { user, loading: authLoading, profile, loading: shopLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: 'Você saiu!',
        description: 'Você foi desconectado com sucesso.',
        duration: 2000,
      });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        title: 'Erro ao sair',
        description: 'Não foi possível desconectar. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="items-center justify-start gap-3 p-4 text-3xl">
          <EngrenAppLogo />
          <span className="font-semibold text-sidebar-foreground">
            {shopLoading ? <Skeleton className="h-6 w-24" /> : profile?.name || 'EngrenApp'}
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard"
                asChild
                isActive={isActive('/dashboard')}
                tooltip="Dashboard"
              >
                <a href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/quotes/new"
                asChild
                isActive={isActive('/quotes/new')}
                tooltip="Novo Orçamento"
              >
                <a href="/quotes/new">
                  <PlusCircle />
                  <span>Novo Orçamento</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/quotes"
                asChild
                isActive={isActive('/quotes')}
                tooltip="Orçamentos"
              >
                <a href="/quotes">
                  <FileText />
                  <span>Orçamentos</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                href="/schedules"
                asChild
                isActive={isActive('/schedules')}
                tooltip="Agendamentos"
              >
                <a href="/schedules">
                  <Calendar />
                  <span>Agendamentos</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/sales"
                asChild
                isActive={isActive('/sales')}
                tooltip="Vendas"
              >
                <a href="/sales">
                  <ShoppingCart />
                  <span>Vendas</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                href="/history"
                asChild
                isActive={isActive('/history')}
                tooltip="Histórico"
              >
                <a href="/history">
                  <History />
                  <span>Histórico</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/customers"
                asChild
                isActive={isActive('/customers')}
                tooltip="Clientes"
              >
                <a href="/customers">
                  <Users />
                  <span>Clientes</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/products"
                asChild
                isActive={isActive('/products')}
                tooltip="Produtos e Serviços"
              >
                <a href="/products">
                  <Package />
                  <span>Produtos</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/settings"
                asChild
                isActive={isActive('/settings')}
                tooltip="Configurações"
              >
                <a href="/settings">
                  <Settings />
                  <span>Configurações</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
                    <LogOut />
                    <span>Sair</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-end border-b bg-card p-4">
            <SidebarTrigger className="lg:hidden"/>
        </header>
        <main className="relative flex-1 overflow-y-auto p-4 md:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
    </AuthProvider>
  )
}
