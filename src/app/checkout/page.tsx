'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Check,
  CreditCard,
  HelpCircle,
  Lock,
  LockOpen,
  Loader2,
  Trash2,
  Truck,
  User,
  PartyPopper,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getImageById } from '@/lib/placeholder-images';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons/logo-icon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, name: 'Identificação', status: 'complete', icon: Check },
  { id: 2, name: 'Entrega', status: 'complete', icon: Check },
  { id: 3, name: 'Pagamento', status: 'current', icon: null },
];

type ShippingOption = {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  error?: string;
};

export default function CheckoutPage() {
  const summaryImg1 = getImageById('summary-1');
  const summaryImg2 = getImageById('summary-2');
  const visaIcon = getImageById('visa-icon');
  const mastercardIcon = getImageById('mastercard-icon');
  const amexIcon = getImageById('amex-icon');
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();
  
  // Simulating fetching shipping/subtotal from a previous step
  const [subtotal, setSubtotal] = useState(205);
  const [shippingCost, setShippingCost] = useState(24.90);

  const total = subtotal + shippingCost;


  const handlePayment = async () => {
    setIsProcessingPayment(true);
    // Simula uma chamada de API de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    toast({
        title: "Pagamento Aprovado!",
        description: "Seu pedido foi realizado com sucesso.",
    })
  }

  
  if (paymentSuccess) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
            <PartyPopper className="mb-6 h-24 w-24 text-primary animate-bounce"/>
            <h1 className="font-headline text-4xl font-bold text-foreground">Obrigado pela sua compra!</h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">Seu pedido <span className="font-bold text-foreground">#12345</span> foi confirmado e em breve será preparado para envio.</p>
            <p className="mt-2 text-sm text-muted-foreground">Enviamos todos os detalhes para o seu e-mail.</p>
            <Button asChild className="mt-8 rounded-full">
                <Link href="/products">
                    Continuar Comprando
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-display text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md dark:bg-background-dark/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LogoIcon />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight">
              Perfumes & Decantes
            </span>
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
                  <li
                    key={step.name}
                    className="relative flex flex-1 flex-col items-center"
                  >
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
                        <span
                          className={`text-sm font-bold ${
                            step.status === 'current'
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </a>
                    <span
                      className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                        step.status === 'upcoming'
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
            
            <section>
                 <Link href="/checkout/address" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft size={16}/>
                    Voltar para Entrega
                 </Link>

                <div className="mb-6 flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CreditCard className="size-4" />
                    </div>
                    <h2 className="font-headline text-xl font-black tracking-tight text-foreground">
                    Pagamento
                    </h2>
                </div>
                <div className="rounded-2xl border bg-card p-6 shadow-sm dark:bg-white/5 sm:p-8">
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h3 className="text-lg font-bold text-foreground">
                        Cartão de Crédito
                    </h3>
                    <div className="flex gap-2 opacity-80">
                        {visaIcon && (
                        <div className="h-8 w-12 rounded-md border bg-muted object-contain p-1">
                            <Image
                            src={visaIcon.imageUrl}
                            width={48}
                            height={32}
                            alt="Visa"
                            data-ai-hint="visa icon"
                            />
                        </div>
                        )}
                        {mastercardIcon && (
                        <div className="h-8 w-12 rounded-md border bg-muted object-contain p-1">
                            <Image
                            src={mastercardIcon.imageUrl}
                            width={48}
                            height={32}
                            alt="Mastercard"
                            data-ai-hint="mastercard icon"
                            />
                        </div>
                        )}
                        {amexIcon && (
                        <div className="h-8 w-12 rounded-md border bg-muted object-contain p-1">
                            <Image
                            src={amexIcon.imageUrl}
                            width={48}
                            height={32}
                            alt="Amex"
                            data-ai-hint="amex icon"
                            />
                        </div>
                        )}
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Número do Cartão
                        </Label>
                        <div className="relative">
                        <Input
                            placeholder="0000 0000 0000 0000"
                            className="pr-10"
                        />
                        <Lock className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground" />
                        </div>
                    </div>
                    <div className="col-span-1 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Validade
                        </Label>
                        <Input placeholder="MM/AA" />
                    </div>
                    <div className="col-span-1 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        CVC
                        </Label>
                        <div className="relative">
                        <Input placeholder="123" className="pr-10" />
                        <HelpCircle className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground" />
                        </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Nome no Cartão
                        </Label>
                        <Input placeholder="Como impresso no cartão" />
                    </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                    <Checkbox id="save-card" />
                    <Label
                        htmlFor="save-card"
                        className="cursor-pointer text-sm font-medium text-foreground"
                    >
                        Salvar cartão para compras futuras
                    </Label>
                    </div>
                </div>
            </section>

          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-xl shadow-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <h2 className="mb-6 font-headline text-xl font-black text-foreground">
                Resumo do Pedido
              </h2>
              <ul className="mb-6 divide-y divide-border">
                <li className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-muted">
                    {summaryImg1 && (
                      <Image
                        src={summaryImg1.imageUrl}
                        alt={summaryImg1.description}
                        fill
                        className="object-cover"
                        data-ai-hint={summaryImg1.imageHint}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-bold text-foreground">
                      <h3>Chanel Bleu</h3>
                      <p className="ml-2">R$ 120,00</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Decant 10ml
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                       <p className="rounded-lg bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
                        Qtd: 1
                      </p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-muted">
                    {summaryImg2 && (
                      <Image
                        src={summaryImg2.imageUrl}
                        alt={summaryImg2.description}
                        fill
                        className="object-cover"
                        data-ai-hint={summaryImg2.imageHint}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-bold text-foreground">
                      <h3>Dior Sauvage</h3>
                      <p className="ml-2">{formatCurrency(85)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Decant 5ml
                    </p>
                     <div className="mt-auto flex items-center justify-between">
                       <p className="rounded-lg bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
                        Qtd: 1
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Cupom de desconto"
                    className="text-sm"
                  />
                  <Button variant="secondary" className="font-bold">
                    Aplicar
                  </Button>
                </div>
              </div>
              <div className="space-y-4 border-t border-dashed pt-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <p>Subtotal</p>
                  <p className="font-medium text-foreground">
                    {formatCurrency(subtotal)}
                  </p>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <p>Frete</p>
                  <p className="font-medium text-foreground">
                    {formatCurrency(shippingCost)}
                  </p>
                </div>
                <div className="flex items-end justify-between border-t pt-4">
                  <p className="font-headline text-lg font-black text-foreground">
                    Total
                  </p>
                  <div className="text-right">
                    <p className="font-headline text-3xl font-black tracking-tight text-foreground">
                      {formatCurrency(total)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      em até 3x sem juros
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="group flex h-auto w-full items-center justify-center rounded-full bg-primary py-4 px-6 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/30"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="mr-2 animate-spin" />
                  ) : (
                    <LockOpen className="mr-2 transition-transform group-hover:scale-110" />
                  )}
                  {isProcessingPayment ? 'Processando...' : `Pagar ${formatCurrency(total)}`}
                </Button>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <Lock className="size-4" />
                    Ambiente 100% Seguro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-card py-8 dark:bg-black/20">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Perfumes & Decantes. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
