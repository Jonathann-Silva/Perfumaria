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
import Image from 'next/image';
import { getImageById } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '#', label: 'Pedidos', icon: ShoppingBag, badge: '3' },
  { href: '#', label: 'Clientes', icon: Users },
  { href: '#', label: 'Configurações', icon: Settings },
];

function NavContent() {
  const pathname = usePathname();
  const adminAvatar = getImageById('admin-avatar');

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="relative size-12 shrink-0 rounded-full shadow-sm">
            {adminAvatar && (
              <Image
                src={adminAvatar.imageUrl}
                alt={adminAvatar.description}
                fill
                className="rounded-full object-cover"
                data-ai-hint={adminAvatar.imageHint}
              />
            )}
            <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-green-500 dark:border-[#1a190b]"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight text-foreground">
              Admin Store
            </h1>
            <p className="text-sm font-normal text-muted-foreground">
              Gerente Geral
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
                className={cn(
                  'group flex items-center gap-3 rounded-full px-4 py-3 text-muted-foreground transition-colors hover:bg-muted/50 dark:hover:bg-white/5',
                  isActive && 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                )}
              >
                <link.icon
                  className={cn(
                    'text-muted-foreground group-hover:text-foreground',
                    isActive ? 'fill-current' : ''
                  )}
                  size={24}
                />
                <p className={cn('text-sm font-medium', isActive && 'font-bold')}>
                  {link.label}
                </p>
                {link.badge && (
                  <Badge className="ml-auto bg-primary text-[10px] font-bold text-primary-foreground">
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
          className="flex w-full cursor-pointer items-center gap-3 rounded-full px-4 py-3 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut />
          <p className="text-sm font-medium">Sair</p>
        </Link>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="hidden h-full w-72 shrink-0 flex-col justify-between border-r border-border bg-card p-6 dark:bg-[#1a190b] lg:flex">
        <NavContent />
      </aside>

      <div className="lg:hidden">
         <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-5 left-5 z-30">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col justify-between bg-card p-6 dark:bg-[#1a190b]">
                 <NavContent />
            </SheetContent>
         </Sheet>
      </div>
    </>
  );
}
