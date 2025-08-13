import { SalesForm } from '@/components/sales-form';

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Registrar Nova Venda</h1>
      </div>
      <SalesForm />
    </div>
  );
}
