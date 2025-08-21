
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
    // This provider is being deprecated in favor of the new logic in AuthProvider.
    // It is kept here to avoid breaking the build immediately but should be removed.
    setLoading(false);
  }, []);


  useEffect(() => {
    // This provider is being deprecated in favor of the new logic in AuthProvider.
    // It is kept here to avoid breaking the build immediately but should be removed.
    setLoading(false);
  }, []);

  return (
    <ShopContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
