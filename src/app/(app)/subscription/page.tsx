
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionPage() {
  const currentPlan = {
    name: 'Plano Pro',
    price: 'R$ 99,90/mês',
    features: [
      'Gerenciamento de Clientes Ilimitado',
      'Criação de Orçamentos e Vendas',
      'Controle de Estoque de Peças',
      'Agenda de Serviços',
      'Histórico Completo de Veículos',
      'Suporte Prioritário',
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
      </div>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
          <CardDescription>
            Você está inscrito no {currentPlan.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold">{currentPlan.price}</p>
          </div>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Gerenciar Assinatura
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
