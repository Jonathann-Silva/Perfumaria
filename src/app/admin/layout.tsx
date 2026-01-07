import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { PageHeader } from '@/components/layout/page-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background font-body text-foreground">
      <AdminSidebar />
      <main className="flex h-full flex-1 flex-col overflow-y-auto">
        <PageHeader />
        <div className="mx-auto w-full max-w-7xl flex-col gap-8 px-6 pb-12 lg:px-8 flex">
          {children}
        </div>
      </main>
    </div>
  );
}
