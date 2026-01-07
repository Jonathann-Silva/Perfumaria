'use client'

import { Bell, Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PageHeader() {

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 px-8 py-5 backdrop-blur-md">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-4 text-muted-foreground" />
          <span className="font-medium text-foreground">Gerenciar Produtos</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full shadow-sm">
          <Bell />
        </Button>
      </div>
    </header>
  );
}
