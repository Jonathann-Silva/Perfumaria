import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { PageHeader } from '@/components/layout/page-header';
import { NotificationProvider } from '@/context/notification-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex min-h-screen w-full bg-background font-body text-foreground">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <PageHeader />
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
