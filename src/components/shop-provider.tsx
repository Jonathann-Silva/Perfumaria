
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ShopProfile } from '@/lib/types';

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
    
    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<ShopProfile>;
        // Set default status to 'overdue' for testing the payment wall
        const profileData: ShopProfile = {
          name: data.name || 'EngrenApp',
          phone: data.phone || '(11) 98765-4321',
          address: data.address || 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: data.cnpj || '00.000.000/0001-00',
          subscriptionStatus: data.subscriptionStatus || 'overdue',
        };
        setProfile(profileData);
      } else {
        // Set default values if no profile exists yet
        setProfile({
          name: 'EngrenApp',
          phone: '(11) 98765-4321',
          address: 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: '00.000.000/0001-00',
          subscriptionStatus: 'overdue', // Default to overdue to show the payment wall
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shop profile: ", error);
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ShopContext.Provider value={{ profile, loading }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
