
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function PaymentWall() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="mt-4">Pagamento Pendente</CardTitle>
          <CardDescription>
            Para continuar usando todas as funcionalidades do EngrenApp, por favor, regularize sua assinatura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/subscription">Regularizar Pagamento</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
