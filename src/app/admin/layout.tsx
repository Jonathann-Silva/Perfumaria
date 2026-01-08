'use client';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { PageHeader } from '@/components/layout/page-header';
import { NotificationProvider } from '@/context/notification-context';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen w-full bg-background font-body text-foreground">
        <AdminSidebar isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="flex flex-1 flex-col">
          <PageHeader onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto h-full w-full max-w-7xl pt-10 lg:pt-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
