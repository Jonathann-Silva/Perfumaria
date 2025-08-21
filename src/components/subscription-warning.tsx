
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useShop } from './shop-provider';
import { differenceInDays, parseISO } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

export function SubscriptionWarning() {
  const router = useRouter();
  const { profile } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    // A condição principal: a assinatura DEVE estar 'ativa' para o aviso aparecer.
    if (profile && profile.subscriptionStatus === 'active' && profile.nextDueDate) {
      const sessionKey = 'subscription_warning_shown';
      const hasBeenShown = sessionStorage.getItem(sessionKey);

      // Não mostra o aviso se ele já foi exibido nesta sessão do navegador.
      if (hasBeenShown) {
        return;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Zera o tempo para comparar apenas as datas.
      const dueDate = parseISO(profile.nextDueDate);
      
      const daysUntilDue = differenceInDays(dueDate, today);

      // Mostra o aviso apenas se faltarem 6 dias ou menos para o vencimento.
      if (daysUntilDue <= 6 && daysUntilDue >= 0) {
        setDaysRemaining(daysUntilDue);
        setIsOpen(true);
        // Marca que o aviso foi exibido para não mostrar novamente na mesma sessão.
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [profile]);

  // Se o pop-up não deve ser aberto, não renderiza nada.
  if (!isOpen) {
    return null;
  }
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <AlertDialogTitle className="text-center">Aviso de Vencimento</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Sua assinatura está prestes a vencer! Restam apenas {daysRemaining} dia{daysRemaining !== 1 ? 's' : ''}. 
            Renove agora para evitar a interrupção dos serviços.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={() => router.push('/subscription')}>
            Renovar Agora
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
