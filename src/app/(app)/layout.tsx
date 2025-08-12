'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  FileText,
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AutoFlowLogo } from '@/components/icons';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="items-center justify-start gap-3 p-3">
          <AutoFlowLogo className="size-8 text-sidebar-primary" />
          <span className="text-xl font-semibold text-sidebar-foreground">
            AutoFlow
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
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-card p-4 lg:justify-end">
            <SidebarTrigger className="lg:hidden"/>
            <Button variant="outline" asChild>
                <a href="/settings">
                  <Settings className="mr-2" />
                  Configurações
                </a>
            </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
