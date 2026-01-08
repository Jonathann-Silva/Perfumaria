'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Check,
  Copy,
  Lock,
  Loader2,
  Truck,
  PartyPopper,
  ArrowLeft,
  Warehouse,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons/logo-icon';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { createPixPayment } from './payment-actions';

const steps = [
  { id: 1, name: 'Identificação', status: 'complete', icon: Check },
  { id: 2, name: 'Entrega', status: 'complete', icon: Check },
  { id: 3, name: 'Pagamento', status: 'current', icon: null },
];

type PixData = {
  qrCode: string;
  qrCodeBase64: string;
}

function CheckoutPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const { cartItems, cartSubtotal, clearCart } = useCart();
  
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingName, setShippingName] = useState('');
  const [shippingId, setShippingId] = useState('');

  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(true);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = cartSubtotal + shippingCost;
  
  useEffect(() => {
    const cost = parseFloat(searchParams.get('shipping_cost') || '0');
    const name = searchParams.get('shipping_name') || 'Não especificado';
    const id = searchParams.get('shipping_id') || '';

    if (cartSubtotal === 0) {
      router.push('/products');
      return;
    }
    
    setShippingCost(cost);
    setShippingName(name);
    setShippingId(id);

    if (id === 'pickup' && !paymentSuccess) {
      setShowPickupConfirm(true);
    }

    const generatePix = async () => {
      setIsGeneratingPix(true);
      setPaymentError(null);
      
      const paymentResult = await createPixPayment({
        transaction_amount: total,
        description: 'Pagamento de pedido na Perfumes & Decantes',
        payer: {
            email: 'test_user_12345@testuser.com', // Em um app real, pegar o email do usuário logado
        }
      });
      
      if (paymentResult.success && paymentResult.qrCode && paymentResult.qrCodeBase64) {
        setPixData({
            qrCode: paymentResult.qrCode,
            qrCodeBase64: paymentResult.qrCodeBase64,
        });
      } else {
        setPaymentError(paymentResult.error || 'Não foi possível gerar o PIX. Verifique as credenciais da API e tente novamente.');
      }
      setIsGeneratingPix(false);
    }
    
    // Só gerar o PIX se não for retirada no local ou se a retirada for confirmada
    if(id !== 'pickup' || (id === 'pickup' && !showPickupConfirm)) {
       generatePix();
    }
    
  }, [searchParams, paymentSuccess, cartSubtotal, router, total, showPickupConfirm]);

  const handleCopyPixCode = () => {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode);
    toast({
      title: "Código PIX Copiado!",
      description: "Use a função 'PIX Copia e Cola' no seu banco.",
    });
  };

  const handleConfirmPickupAndGeneratePix = async () => {
      setShowPickupConfirm(false);
      // A lógica para gerar PIX já está no useEffect e será acionada quando showPickupConfirm mudar.
  }

  // A função de finalização de pagamento agora só é relevante para
  // cenários de simulação, já que o PIX real depende de webhook para confirmação.
  // Mantemos a simulação para o usuário ver o fluxo.
  const handleSimulateSuccess = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPaymentSuccess(true);
    clearCart();
    toast({
        title: "Pedido Recebido!",
        description: "Aguardando confirmação do pagamento PIX.",
    })
  }

  if (paymentSuccess) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
            <PartyPopper className="mb-6 h-24 w-24 text-primary animate-bounce"/>
            <h1 className="font-headline text-4xl font-bold text-foreground">Obrigado pela sua compra!</h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">Seu pedido <span className="font-bold text-foreground">#12345</span> foi recebido e está aguardando a confirmação do pagamento PIX.</p>
            <p className="mt-2 text-sm text-muted-foreground">Enviaremos uma confirmação para o seu e-mail assim que o pagamento for aprovado.</p>
            <Button asChild className="mt-8 rounded-full">
                <Link href="/products">
                    Continuar Comprando
                </Link>
            </Button>
        </div>
    )
  }


  return (
    <>
    <AlertDialog open={showPickupConfirm} onOpenChange={setShowPickupConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
             <Warehouse className="size-12 text-primary" />
          </div>
          <AlertDialogTitle className="text-center">Confirmação de Retirada</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Você confirma a retirada do seu pedido em nossa loja física em Arapongas-PR?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel onClick={() => router.back()}>Voltar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmPickupAndGeneratePix}>Confirmar e Pagar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

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
                    <QrCode className="size-4" />
                    </div>
                    <h2 className="font-headline text-xl font-black tracking-tight text-foreground">
                    Pagamento com PIX
                    </h2>
                </div>
                <div className="rounded-2xl border bg-card p-6 shadow-sm dark:bg-white/5 sm:p-8">
                  {isGeneratingPix ? (
                     <div className="flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="font-bold">Gerando PIX...</p>
                        <p className="text-sm text-center">Estamos criando uma cobrança segura para você.</p>
                     </div>
                  ) : paymentError ? (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro ao Gerar Pagamento</AlertTitle>
                        <AlertDescription>
                           {paymentError}
                        </AlertDescription>
                     </Alert>
                  ) : pixData ? (
                    <div className='flex flex-col md:flex-row items-center justify-center md:justify-start gap-8'>
                      <div className='flex flex-col items-center gap-4'>
                        <p className='text-sm font-bold text-foreground text-center'>Escaneie o QR Code para pagar</p>
                        <div className="p-4 bg-white rounded-lg border shadow-inner">
                            <Image
                                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                width={200}
                                height={200}
                                alt="QR Code para pagamento PIX"
                            />
                        </div>
                      </div>
                      <div className="flex-1 w-full text-center md:text-left">
                          <h3 className="font-bold text-foreground">Instruções de Pagamento</h3>
                          <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-2">
                            <li>Abra o aplicativo do seu banco e acesse a área PIX.</li>
                            <li>Escolha a opção "Pagar com QR Code".</li>
                            <li>Escaneie o código ao lado.</li>
                            <li>Se preferir, use o "PIX Copia e Cola" abaixo.</li>
                            <li>Confirme os dados e o valor e finalize o pagamento.</li>
                          </ol>
                          <div className="mt-6">
                            <Label className='text-xs font-bold uppercase text-muted-foreground'>PIX Copia e Cola</Label>
                            <div className='relative mt-1'>
                               <Input 
                                  readOnly 
                                  value={pixData.qrCode} 
                                  className="bg-muted dark:bg-background pr-12 truncate"
                                />
                               <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleCopyPixCode}>
                                 <Copy className="size-4" />
                               </Button>
                            </div>
                            <p className='text-xs text-muted-foreground mt-4'>O pagamento é confirmado em instantes. Após a confirmação, seu pedido será processado.</p>
                          </div>
                      </div>
                    </div>
                  ) : null }
                </div>
            </section>

          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-xl shadow-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <h2 className="mb-6 font-headline text-xl font-black text-foreground">
                Resumo do Pedido
              </h2>
               {cartItems.length > 0 ? (
                <ul className="mb-6 divide-y divide-border">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-muted">
                        <Image
                          src={getImageById(item.imageId)?.imageUrl || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-bold text-foreground">
                          <h3>{item.name}</h3>
                          <p className="ml-2">{formatCurrency(item.price)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.type === 'decant' ? `Decant ${item.decantMl}ml` : 'Frasco'}
                        </p>
                        <p className="mt-1 rounded-lg bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground self-start">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Seu carrinho está vazio.
                </div>
              )}
              <div className="space-y-4 border-t border-dashed pt-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <p>Subtotal</p>
                  <p className="font-medium text-foreground">
                    {formatCurrency(cartSubtotal)}
                  </p>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <p>Frete ({shippingName})</p>
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
                      Pagamento via PIX
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button
                  onClick={handleSimulateSuccess}
                  disabled={!pixData || isGeneratingPix || paymentError}
                  className="group flex h-auto w-full items-center justify-center rounded-full bg-primary py-4 px-6 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/30"
                >
                  <Check className="mr-2 transition-transform group-hover:scale-110" />
                  Já Paguei, Finalizar Pedido
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
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="size-12 animate-spin text-primary"/></div>}>
      <CheckoutPaymentPage />
    </Suspense>
  )
}
