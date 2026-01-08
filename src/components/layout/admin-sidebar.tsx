'use client';

import {
  LogOut,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent } from '../ui/sheet';
import { LogoIcon } from '../icons/logo-icon';


const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag, badge: '3' },
  { href: '/admin/customers', label: 'Clientes', icon: Users },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 px-2">
           <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LogoIcon className="size-6" />
            </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight text-foreground">
              Admin Store
            </h1>
            <p className="text-sm font-normal text-muted-foreground">
              Painel de Controle
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onLinkClick}
                className={cn(
                  'group flex items-center gap-3 rounded-full px-4 py-3 text-muted-foreground transition-colors hover:bg-muted/50 dark:hover:bg-white/5',
                  isActive && 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                )}
              >
                <link.icon
                  className={cn(
                    'text-muted-foreground group-hover:text-foreground',
                     isActive ? 'text-primary-foreground' : ''
                  )}
                  size={20}
                />
                <p className={cn('text-sm font-medium', isActive && 'font-bold')}>
                  {link.label}
                </p>
                {link.badge && (
                  <Badge className="ml-auto bg-yellow-300 text-[10px] font-bold text-black hover:bg-yellow-300">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex">
        <Link
          href="/admin/login"
          onClick={onLinkClick}
          className="flex w-full cursor-pointer items-center gap-3 rounded-full px-4 py-3 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut />
          <p className="text-sm font-medium">Sair</p>
        </Link>
      </div>
    </>
  );
}

interface AdminSidebarProps {
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (isOpen: boolean) => void;
}

export function AdminSidebar({ isMobileMenuOpen, setMobileMenuOpen }: AdminSidebarProps) {
  return (
    <>
      <aside className="hidden h-screen w-72 shrink-0 flex-col justify-between border-r border-border bg-card p-6 dark:bg-[#1a190b] lg:flex">
        <NavContent />
      </aside>
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="flex w-72 flex-col justify-between bg-card p-6 dark:bg-[#1a190b]">
                <NavContent onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
