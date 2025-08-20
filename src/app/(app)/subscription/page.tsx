
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
import { CreditCard, Loader2 } from 'lucide-react';
import { useShop } from '@/components/shop-provider';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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
  
  const isSubscriptionActive = profile?.subscriptionStatus === 'active';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
      </div>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{currentPlan.name}</CardTitle>
          <CardDescription>
            {isSubscriptionActive 
              ? "Sua assinatura está ativa. A próxima cobrança será em 30 dias."
              : "Preencha os dados abaixo para ativar sua assinatura."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">VALOR MENSAL</p>
            <p className="text-4xl font-bold">{currentPlan.price}</p>
          </div>
          
          {isSubscriptionActive ? (
            <div className='text-center text-green-600 font-medium pt-4'>
              Obrigado por ser um assinante!
            </div>
          ) : (
            <div className="space-y-4 pt-4">
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
            </div>
          )}

        </CardContent>
        {!isSubscriptionActive && (
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
        )}
      </Card>
    </div>
  );
}
