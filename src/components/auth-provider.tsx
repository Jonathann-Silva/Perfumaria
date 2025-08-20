
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { ShopProvider } from './shop-provider';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      const isAuthPage = pathname === '/login';

      if (!user && !isAuthPage) {
        router.push('/login');
      }
      
      if (user && isAuthPage) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // If we are still loading the authentication state, show a global loader
  if (loading) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // If there's a user, it means we are on an authenticated page,
  // so we can safely wrap the children with ShopProvider.
  if (user) {
    return (
       <AuthContext.Provider value={{ user, loading }}>
        <ShopProvider>
          {children}
        </ShopProvider>
      </AuthContext.Provider>
    )
  }
  
  // If there's no user, we are on the login page, so we don't need the ShopProvider.
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
