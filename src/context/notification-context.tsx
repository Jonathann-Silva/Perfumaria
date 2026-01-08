'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils';

interface SaleNotification {
  id: string;
  user: string;
  amount: number;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: SaleNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<SaleNotification[]>([]);

  const fetchNotifications = useCallback(() => {
    const storedSales = JSON.parse(localStorage.getItem('newSales') || '[]');
    setNotifications(storedSales.sort((a: SaleNotification, b: SaleNotification) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  useEffect(() => {
    fetchNotifications();

    const handleStorageChange = () => {
      fetchNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event to handle changes in the same tab
    window.addEventListener('newSale', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newSale', handleStorageChange);
    };
  }, [fetchNotifications]);
  
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('newSales', JSON.stringify(updatedNotifications));
  };


  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
