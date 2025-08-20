
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

  useEffect(() => {
    if (profile && profile.subscriptionStatus === 'active' && profile.nextDueDate) {
      const sessionKey = 'subscription_warning_shown';
      const hasBeenShown = sessionStorage.getItem(sessionKey);

      if (hasBeenShown) {
        return;
      }
      
      const today = new Date();
      const dueDate = parseISO(profile.nextDueDate);
      const daysUntilDue = differenceInDays(dueDate, today);

      if (daysUntilDue <= 6 && daysUntilDue >= 0) {
        setIsOpen(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [profile]);

  if (!isOpen) {
    return null;
  }
  
  const today = new Date();
  const dueDate = profile?.nextDueDate ? parseISO(profile.nextDueDate) : new Date();
  let daysRemaining = differenceInDays(dueDate, today);

  // Ensure daysRemaining is not negative for display
  if (daysRemaining < 0) {
    daysRemaining = 0;
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
            Sua assinatura está prestes a vencer! Restam apenas {daysRemaining} dia{daysRemaining !== 1 ? 's'}. 
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
