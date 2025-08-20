
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
        setProfile(docSnap.data() as ShopProfile);
      } else {
        // Set default values if no profile exists yet
        setProfile({
          name: 'EngrenApp',
          phone: '(11) 98765-4321',
          address: 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
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
