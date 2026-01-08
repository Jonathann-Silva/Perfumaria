import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { PageHeader } from '@/components/layout/page-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background font-body text-foreground">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <PageHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto h-full w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
