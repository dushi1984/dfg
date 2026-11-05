export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'operator';
  name: string;
  department: string;
}

export interface ProductionOrder {
  id: string;
  poNumber: string;
  clientName: string;
  styleName: string;
  styleCode: string;
  orderQty: number;
  cutQty: number;
  laundryQty: number;
  packedQty: number;
  shippedQty: number;
  completionPercent: number;
  orderDate: string;
  deliveryDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'laundry' | 'packing' | 'final' | 'shipping' | 'completed';
  notes: string;
  cautions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error' | 'caution';
  title: string;
  message: string;
  poId?: string;
  read: boolean;
  createdAt: string;
}

export interface DepartmentStats {
  department: string;
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  totalPieces: number;
  completionRate: number;
}

export type Page = 'dashboard' | 'orders' | 'packing' | 'laundry' | 'final' | 'shipping' | 'notifications' | 'departments';
