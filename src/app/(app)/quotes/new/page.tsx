import { QuoteForm } from '@/components/quote-form';

export default function NewQuotePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Criar Novo Orçamento</h1>
      </div>
      <QuoteForm />
    </div>
  );
}
