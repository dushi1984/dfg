import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductionOrder, Notification } from '../types';
import { seedOrders, seedNotifications } from '../data/seedData';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  orders: ProductionOrder[];
  notifications: Notification[];
  addOrder: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<ProductionOrder>) => void;
  deleteOrder: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  deleteNotification: (id: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedOrders = localStorage.getItem('factoryflow_orders');
      const storedNotifications = localStorage.getItem('factoryflow_notifications');
      setOrders(storedOrders ? JSON.parse(storedOrders) : seedOrders);
      setNotifications(storedNotifications ? JSON.parse(storedNotifications) : seedNotifications);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('factoryflow_orders', JSON.stringify(orders));
    }
  }, [orders, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('factoryflow_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isLoading]);

  const addOrder = useCallback((order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: ProductionOrder = {
      ...order,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setNotifications(prev => [{
      id: uuidv4(),
      type: 'info',
      title: 'New Order Created',
      message: `${order.poNumber} for ${order.clientName} has been created. ${order.orderQty} units.`,
      poId: newOrder.id,
      read: false,
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<ProductionOrder>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o));
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [{
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{
      orders, notifications, addOrder, updateOrder, deleteOrder,
      markNotificationRead, markAllNotificationsRead, addNotification, deleteNotification, isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
