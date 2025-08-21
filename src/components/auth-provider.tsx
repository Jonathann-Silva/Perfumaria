
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { ShopProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: ShopProfile | null;
  refreshProfile?: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, profile: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = useCallback((currentUser: User) => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid, 'shopSettings', 'profile');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<ShopProfile>;
        const profileData: ShopProfile = {
          name: data.name || 'Sua Oficina',
          phone: data.phone || '',
          address: data.address || '',
          cnpj: data.cnpj || '',
          logoUrl: data.logoUrl || '',
        };
        setProfile(profileData);
      } else {
        // If profile doesn't exist for a logged-in user, create a default one
        const defaultProfile: ShopProfile = {
          name: 'Sua Oficina',
          phone: '',
          address: '',
          cnpj: '',
          logoUrl: '',
        };
        setDoc(docRef, defaultProfile).then(() => {
          setProfile(defaultProfile);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shop profile: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const isAuthPage = pathname === '/login';

      if (currentUser) {
        const unsubscribeProfile = fetchProfile(currentUser);
        if (isAuthPage) {
            router.push('/dashboard');
        }
        return () => {
          if (unsubscribeProfile) unsubscribeProfile();
        };
      } else {
        setProfile(null);
        setLoading(false);
        if (!isAuthPage) {
          router.push('/login');
        }
      }
    });

    return () => unsubscribeAuth();
  }, [router, pathname, fetchProfile]);

  if (loading) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, profile, refreshProfile: user ? () => fetchProfile(user) : undefined }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
