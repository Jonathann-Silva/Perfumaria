import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-headline text-4xl font-black leading-tight tracking-tight text-foreground">
            Configurações da Loja
          </h1>
          <p className="text-lg text-muted-foreground">
            Ajuste as configurações gerais, de pagamento e envio.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-card shadow-sm dark:bg-[#1a190b]">
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted text-primary dark:bg-neutral-800">
                <Settings className="size-8" />
            </div>
            <div className="max-w-sm">
                <h2 className="text-lg font-bold text-foreground">Configurações</h2>
                <p className="text-sm text-muted-foreground">
                    Esta seção está em desenvolvimento. Em breve, você poderá configurar todos os aspectos da sua loja aqui.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
