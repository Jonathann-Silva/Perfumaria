
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ShopProfile } from '@/lib/types';
import { addDays, formatISO, setDate } from 'date-fns';

interface ShopContextType {
  profile: ShopProfile | null;
  loading: boolean;
}

const ShopContext = createContext<ShopContextType>({ profile: null, loading: true });

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'shopSettings', 'profile');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<ShopProfile>;
        
        // --- SIMULATION LOGIC ---
        // To test the warning, we set a due date that is X days from now.
        // For a real app, this date would come from the payment gateway.
        const today = new Date();
        // For this test, let's set a due date 5 days from today
        const simulatedDueDate = addDays(today, 5);
        // --- END SIMULATION LOGIC ---

        const profileData: ShopProfile = {
          name: data.name || 'EngrenApp',
          phone: data.phone || '(11) 98765-4321',
          address: data.address || 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: data.cnpj || '00.000.000/0001-00',
          // If a status exists, use it. Otherwise, default to 'active' for testing the warning.
          subscriptionStatus: data.subscriptionStatus || 'active', 
          // Use a real due date if available, otherwise use our simulation
          nextDueDate: data.nextDueDate || formatISO(simulatedDueDate, { representation: 'date' }),
        };
        setProfile(profileData);
      } else {
        // Set default values if no profile exists yet
        setProfile({
          name: 'EngrenApp',
          phone: '(11) 98765-4321',
          address: 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: '00.000.000/0001-00',
          subscriptionStatus: 'overdue', 
          nextDueDate: formatISO(new Date(), { representation: 'date' })
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shop profile: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ShopContext.Provider value={{ profile, loading }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
