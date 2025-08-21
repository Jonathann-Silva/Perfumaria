
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
import { CreditCard, Loader2, QrCode, Copy } from 'lucide-react';
import { useShop } from '@/components/shop-provider';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { parseISO, getDate, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  
  // Show payment options if the subscription is not active,
  // or if it is active and today is on or after the 1st of the month.
  let showPaymentOptions = !isSubscriptionActive;
  if (isSubscriptionActive && profile?.nextDueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (getDate(today) >= 1) {
        showPaymentOptions = true;
    }
  }
  
  const nextDueDate = profile?.nextDueDate ? parseISO(profile.nextDueDate) : null;
  const formattedDueDate = nextDueDate ? format(nextDueDate, "'dia' dd 'de' MMMM", { locale: ptBR }) : 'todo dia 10';


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
              ? `Sua assinatura está ativa. A próxima cobrança será ${formattedDueDate}.`
              : "Use PIX para ativar ou renovar sua assinatura."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">VALOR MENSAL</p>
            <p className="text-4xl font-bold">{currentPlan.price}</p>
          </div>
          
          {showPaymentOptions ? (
             <Card className="mt-4">
              <CardHeader className='pb-2'>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <QrCode className="h-5 w-5" /> Pagamento via PIX
                  </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4 text-center">
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
