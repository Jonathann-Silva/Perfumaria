'use client';

import { Bell, Menu, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePathname } from 'next/navigation';
import { useNotifications } from '@/context/notification-context';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';


export function PageHeader({ onMobileMenuToggle }: { onMobileMenuToggle: () => void; }) {
  const pathname = usePathname();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  
  const getBreadcrumb = () => {
    const page = navLinks.find(link => pathname.startsWith(link.href) && link.href !== '/admin');
    return page ? page.label : 'Dashboard';
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur-md lg:px-8">
       <div className="flex items-center gap-4">
        <div className="lg:hidden">
            <Button variant="outline" size="icon" className="rounded-full" onClick={onMobileMenuToggle}>
                <Menu/>
            </Button>
      </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
             {pathname !== '/admin' && (
              <>
                <ChevronRight className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{getBreadcrumb()}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Popover onOpenChange={(open) => { if (!open) markAllAsRead() }}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full shadow-sm">
                    <Bell />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-3 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                    <h3 className="text-sm font-bold">Notificações</h3>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(sale => (
                            <div key={sale.id} className={cn("flex items-start gap-3 rounded-lg p-3", !sale.read && 'bg-muted')}>
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <ShoppingBag className="size-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs">
                                        Nova venda de <span className="font-bold">{sale.user}</span> no valor de <span className="font-bold">{formatCurrency(sale.amount)}</span>.
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(new Date(sale.timestamp), { addSuffix: true, locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-8 text-center text-sm text-muted-foreground">Nenhuma notificação nova.</p>
                    )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 border-t text-center">
                    <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">Ver todos os pedidos</Link>
                  </div>
                )}
            </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
