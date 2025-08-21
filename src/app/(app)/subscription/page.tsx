
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, QrCode, Copy } from 'lucide-react';
import { useShop } from '@/components/shop-provider';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { differenceInDays, parseISO } from 'date-fns';

export default function SubscriptionPage() {
  const { profile } = useShop();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = {
    name: 'Plano Pro',
    price: 'R$ 60,00/mês',
    priceValue: 60.00,
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulates a payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const docRef = doc(db, 'shopSettings', 'profile');
      await setDoc(docRef, { subscriptionStatus: 'active' }, { merge: true });
      
      toast({
        title: 'Pagamento Aprovado!',
        description: 'Sua assinatura está ativa. Obrigado!',
      });
    } catch (error) {
       console.error("Error updating subscription status: ", error);
       toast({
        title: 'Erro no Pagamento',
        description: 'Não foi possível processar seu pagamento. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleCopyPixCode = () => {
    const pixCode = '00020126330014br.gov.bcb.pix0111123456789010212EngrenApp Inc.520400005303986540660.005802BR5913EngrenApp Inc.6009SAO PAULO62070503***6304E2A4';
    navigator.clipboard.writeText(pixCode);
    toast({
      title: 'Código PIX Copiado!',
      description: 'Use o código no seu app do banco para pagar.',
    });
  }

  const isSubscriptionActive = profile?.subscriptionStatus === 'active';
  let daysUntilDue = 99;
  if (profile?.nextDueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseISO(profile.nextDueDate);
    daysUntilDue = differenceInDays(dueDate, today);
  }

  // Show payment options if the subscription is not active, or if it is active but expiring soon.
  const showPaymentOptions = !isSubscriptionActive || (isSubscriptionActive && daysUntilDue <= 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
      </div>
      <Card className="max-w-xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{currentPlan.name}</CardTitle>
          <CardDescription>
            {isSubscriptionActive 
              ? "Sua assinatura está ativa. A próxima cobrança será todo dia 25."
              : "Escolha um método de pagamento para ativar sua assinatura."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">VALOR MENSAL</p>
            <p className="text-4xl font-bold">{currentPlan.price}</p>
          </div>
          
          {showPaymentOptions ? (
            <Tabs defaultValue="credit_card" className="w-full pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credit_card">
                  <CreditCard className="mr-2 h-4 w-4" /> Cartão de Crédito
                </TabsTrigger>
                <TabsTrigger value="pix">
                   <QrCode className="mr-2 h-4 w-4" /> PIX
                </TabsTrigger>
              </TabsList>
              <TabsContent value="credit_card">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Número do Cartão</Label>
                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry-date">Validade</Label>
                            <Input id="expiry-date" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                        </div>
                    </div>
                  </CardContent>
                   <CardFooter>
                    <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
                        {isProcessing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        {isProcessing ? 'Processando...' : `Pagar ${currentPlan.price}`}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="pix">
                 <Card>
                  <CardContent className="pt-6 space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Escaneie o QR Code ou use o código copia e cola no seu app do banco.
                    </p>
                    <div className="flex justify-center">
                       <Image 
                          src="https://placehold.co/200x200.png" 
                          alt="QR Code PIX" 
                          width={200} 
                          height={200}
                          data-ai-hint="qr code"
                          className="rounded-md"
                        />
                    </div>
                    <div className="relative">
                      <Input 
                        readOnly 
                        value="00020126...E2A4" 
                        className="pr-10 text-center text-xs"
                      />
                       <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={handleCopyPixCode}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
                        {isProcessing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Já Paguei, Ativar Assinatura'
                        )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
             <div className='text-center text-green-600 font-medium pt-4'>
              Obrigado por ser um assinante!
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
