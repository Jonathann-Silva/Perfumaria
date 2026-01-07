import Image from 'next/image';
import {
  Check,
  CreditCard,
  HelpCircle,
  Lock,
  LockOpen,
  Search,
  Security,
  Sprout,
  Truck,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getImageById } from '@/lib/placeholder-images';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const steps = [
  { id: 1, name: 'Identificação', status: 'complete', icon: Check },
  { id: 2, name: 'Entrega', status: 'current', icon: null },
  { id: 3, name: 'Pagamento', status: 'upcoming', icon: null },
];

export default function CheckoutPage() {
  const summaryImg1 = getImageById('summary-1');
  const summaryImg2 = getImageById('summary-2');
  const visaIcon = getImageById('visa-icon');
  const mastercardIcon = getImageById('mastercard-icon');
  const amexIcon = getImageById('amex-icon');

  return (
    <div className="flex min-h-screen flex-col bg-background font-display text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md dark:bg-background-dark/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sprout />
            </div>
            <span className="text-xl font-bold tracking-tight font-headline">Aroma Allure</span>
          </Link>
          <div className="flex items-center gap-3 rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground dark:bg-white/10">
            <Lock className="size-4" />
            <span className="hidden sm:inline">Checkout Seguro</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <nav aria-label="Progress">
              <ol role="list" className="flex w-full items-center">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className="relative flex flex-1 flex-col items-center">
                    {stepIdx < steps.length - 1 && (
                      <div
                        className={`absolute left-[50%] right-[-50%] top-4 -z-10 h-0.5 ${
                          step.status === 'complete' ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                    <a
                      href="#"
                      className={`relative flex size-8 items-center justify-center rounded-full ring-4 ring-background ${
                        step.status === 'complete' || step.status === 'current'
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {step.status === 'complete' ? (
                        <Check className="size-4 font-bold text-primary-foreground" />
                      ) : (
                        <span className={`text-sm font-bold ${
                          step.status === 'current' ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}>{step.id}</span>
                      )}
                    </a>
                    <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                      step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                    }`}>{step.name}</span>
                  </li>
                ))}
              </ol>
            </nav>

            <section className="rounded-2xl border bg-card p-6 dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <User className="text-primary" />
                  Dados Pessoais
                </h2>
                <button className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
                  Editar
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-muted-foreground">E-mail cadastrado</p>
                  <p className="font-medium">joao.silva@exemplo.com</p>
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Telefone / Celular</p>
                  <p className="font-medium">(11) 99999-9999</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-col gap-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Truck className="size-4" />
                  </div>
                  <h2 className="font-headline text-xl font-black tracking-tight text-foreground">Endereço de Entrega</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="recipient-name" className="font-bold">Nome do Destinatário</Label>
                    <Input id="recipient-name" placeholder="Ex: João da Silva" defaultValue="João da Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="font-bold">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="font-bold">CEP</Label>
                    <div className="relative">
                      <Input id="zip" placeholder="00000-000" className="pr-12" />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address" className="font-bold">Endereço Completo</Label>
                    <Input id="address" placeholder="Rua, Avenida, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="font-bold">Número</Label>
                    <Input id="number" placeholder="123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement" className="font-bold">Complemento <span className="font-normal text-muted-foreground">(Opcional)</span></Label>
                    <Input id="complement" placeholder="Apto 101, Bloco B" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-muted/50 p-6 dark:bg-white/5">
              <h3 className="mb-4 text-base font-bold text-foreground">Escolha o envio</h3>
              <div className="space-y-3">
                <Label htmlFor="shipping-sedex" className="relative flex cursor-pointer rounded-xl border-2 border-primary bg-card p-4 shadow-sm transition-all">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-6 items-center justify-center rounded-full border border-border bg-card"><div className="size-3 rounded-full bg-primary"></div></div>
                      <div className="flex flex-col">
                        <span className="block text-sm font-bold text-foreground">SEDEX (Melhor Envio)</span>
                        <span className="block text-xs text-muted-foreground">Entrega em 1 a 2 dias úteis</span>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">R$ 24,90</span>
                  </div>
                  <Input type="radio" name="shipping" id="shipping-sedex" defaultChecked className="sr-only" />
                </Label>
                <Label htmlFor="shipping-pac" className="relative flex cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-muted-foreground">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-6 items-center justify-center rounded-full border border-border bg-card"></div>
                      <div className="flex flex-col">
                        <span className="block text-sm font-medium text-foreground">PAC (Correios)</span>
                        <span className="block text-xs text-muted-foreground">Entrega em 5 a 8 dias úteis</span>
                      </div>
                    </div>
                    <span className="font-medium text-foreground">R$ 15,50</span>
                  </div>
                  <Input type="radio" name="shipping" id="shipping-pac" className="sr-only" />
                </Label>
              </div>
            </section>
            
             <section id="payment" className="scroll-mt-24 pt-4">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary"><CreditCard className="size-4" /></div>
                <h2 className="font-headline text-xl font-black tracking-tight text-foreground">Pagamento</h2>
              </div>
              <div className="rounded-2xl border bg-card p-6 shadow-sm dark:bg-white/5 sm:p-8">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-bold text-foreground">Cartão de Crédito</h3>
                  <div className="flex gap-2 opacity-80">
                    {visaIcon && <div className="h-8 w-12 rounded-md border bg-muted object-contain p-1"><Image src={visaIcon.imageUrl} width={48} height={32} alt="Visa" data-ai-hint="visa icon" /></div>}
                    {mastercardIcon && <div className="h-8 w-12 rounded-md border bg-muted object-contain p-1"><Image src={mastercardIcon.imageUrl} width={48} height={32} alt="Mastercard" data-ai-hint="mastercard icon" /></div>}
                    {amexIcon && <div className="h-8 w-12 rounded-md border bg-muted object-contain p-1"><Image src={amexIcon.imageUrl} width={48} height={32} alt="Amex" data-ai-hint="amex icon" /></div>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Número do Cartão</Label>
                    <div className="relative">
                      <Input placeholder="0000 0000 0000 0000" className="pr-10" />
                      <Lock className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground" />
                    </div>
                  </div>
                  <div className="col-span-1 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Validade</Label>
                    <Input placeholder="MM/AA" />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CVC</Label>
                     <div className="relative">
                      <Input placeholder="123" className="pr-10" />
                      <HelpCircle className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome no Cartão</Label>
                    <Input placeholder="Como impresso no cartão" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <Checkbox id="save-card" />
                  <Label htmlFor="save-card" className="cursor-pointer text-sm font-medium text-foreground">Salvar cartão para compras futuras</Label>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-xl shadow-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <h2 className="mb-6 font-headline text-xl font-black text-foreground">Resumo do Pedido</h2>
              <ul className="mb-6 divide-y divide-border">
                <li className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-muted">
                    {summaryImg1 && <Image src={summaryImg1.imageUrl} alt={summaryImg1.description} fill className="object-cover" data-ai-hint={summaryImg1.imageHint}/>}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-base font-bold text-foreground"><h3>Chanel Bleu</h3><p className="ml-2">R$ 120,00</p></div>
                      <p className="text-sm text-muted-foreground">Decant 10ml</p>
                    </div>
                    <p className="rounded-lg bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">Qtd: 1</p>
                  </div>
                </li>
                <li className="flex gap-4 py-4">
                   <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-muted">
                    {summaryImg2 && <Image src={summaryImg2.imageUrl} alt={summaryImg2.description} fill className="object-cover" data-ai-hint={summaryImg2.imageHint}/>}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-base font-bold text-foreground"><h3>Dior Sauvage</h3><p className="ml-2">R$ 85,00</p></div>
                      <p className="text-sm text-muted-foreground">Decant 5ml</p>
                    </div>
                    <p className="rounded-lg bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">Qtd: 1</p>
                  </div>
                </li>
              </ul>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input type="text" placeholder="Cupom de desconto" className="text-sm" />
                  <Button variant="secondary" className="font-bold">Aplicar</Button>
                </div>
              </div>
              <div className="space-y-4 border-t border-dashed pt-6 text-sm">
                <div className="flex justify-between text-muted-foreground"><p>Subtotal</p><p className="font-medium text-foreground">{formatCurrency(205)}</p></div>
                <div className="flex justify-between text-muted-foreground"><p>Frete</p><p className="font-medium text-foreground">{formatCurrency(24.90)}</p></div>
                <div className="flex items-end justify-between border-t pt-4">
                  <p className="font-headline text-lg font-black text-foreground">Total</p>
                  <div className="text-right">
                    <p className="font-headline text-3xl font-black tracking-tight text-foreground">{formatCurrency(229.90)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">em até 3x sem juros</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button className="group flex h-auto w-full items-center justify-center rounded-full bg-primary py-4 px-6 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/30">
                  <LockOpen className="mr-2 transition-transform group-hover:scale-110" />
                  Finalizar Compra
                </Button>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Security className="size-4" />Ambiente 100% Seguro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-card py-8 dark:bg-black/20">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Aroma Allure. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
