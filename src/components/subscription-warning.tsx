
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
import { differenceInDays, parseISO, getDate } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

export function SubscriptionWarning() {
  const router = useRouter();
  const { profile } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    // The main condition: the subscription MUST be 'active' for the warning to appear.
    if (profile && profile.subscriptionStatus === 'active' && profile.nextDueDate) {
      const sessionKey = 'subscription_warning_shown';
      const hasBeenShown = sessionStorage.getItem(sessionKey);

      // Do not show the warning if it has already been shown in this browser session.
      if (hasBeenShown) {
        return;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Zero out the time to compare only dates.
      const dueDate = parseISO(profile.nextDueDate);
      
      const daysUntilDue = differenceInDays(dueDate, today);

      // Show the warning from the 1st of the month until the due date.
      if (getDate(today) >= 1) {
        setDaysRemaining(daysUntilDue >= 0 ? daysUntilDue : 0);
        setIsOpen(true);
        // Mark that the warning has been shown so it doesn't show again in the same session.
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [profile]);

  // If the pop-up should not be opened, do not render anything.
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
