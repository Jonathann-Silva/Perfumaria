
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import type { ShopProfile } from '@/lib/types';
import { formatISO } from 'date-fns';

interface ShopContextType {
  profile: ShopProfile | null;
  loading: boolean;
  refreshProfile?: () => void;
}

const ShopContext = createContext<ShopContextType>({ profile: null, loading: true });

function getNextDueDate(): Date {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let dueDate = new Date(currentYear, currentMonth, 10);

    // If the 10th of the current month has already passed, set it to the 10th of the next month.
    if (today.getDate() > 10) {
        dueDate.setMonth(currentMonth + 1);
    }
    
    return dueDate;
}

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const docRef = doc(db, 'shopSettings', 'profile');
    try {
      const docSnap = await getDoc(docRef);
       if (docSnap.exists()) {
        const data = docSnap.data() as Partial<ShopProfile>;
        
        const nextDueDate = getNextDueDate();

        const profileData: ShopProfile = {
          name: data.name || 'EngrenApp',
          phone: data.phone || '(11) 98765-4321',
          address: data.address || 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: data.cnpj || '00.000.000/0001-00',
          logoUrl: data.logoUrl || '',
          subscriptionStatus: data.subscriptionStatus || 'active', 
          nextDueDate: formatISO(nextDueDate, { representation: 'date' }),
        };
        setProfile(profileData);
      } else {
        const nextDueDate = getNextDueDate();
        setProfile({
          name: 'EngrenApp',
          phone: '(11) 98765-4321',
          address: 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: '00.000.000/0001-00',
          logoUrl: '',
          subscriptionStatus: 'active', 
          nextDueDate: formatISO(nextDueDate, { representation: 'date' })
        });
      }
    } catch (error) {
       console.error("Error fetching shop profile: ", error);
    } finally {
        setLoading(false);
    }
  }, []);


  useEffect(() => {
    const docRef = doc(db, 'shopSettings', 'profile');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<ShopProfile>;
        
        const nextDueDate = getNextDueDate();

        const profileData: ShopProfile = {
          name: data.name || 'EngrenApp',
          phone: data.phone || '(11) 98765-4321',
          address: data.address || 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: data.cnpj || '00.000.000/0001-00',
          logoUrl: data.logoUrl || '',
          subscriptionStatus: data.subscriptionStatus || 'active', 
          nextDueDate: formatISO(nextDueDate, { representation: 'date' }),
        };
        setProfile(profileData);
      } else {
         const nextDueDate = getNextDueDate();
        setProfile({
          name: 'EngrenApp',
          phone: '(11) 98765-4321',
          address: 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          cnpj: '00.000.000/0001-00',
          logoUrl: '',
          subscriptionStatus: 'active', 
          nextDueDate: formatISO(nextDueDate, { representation: 'date' })
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
    <ShopContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
