import { User, ProductionOrder, Notification } from '../types';

export const seedUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Ahmed Hassan', department: 'Management' },
  { id: '2', username: 'manager', password: 'manager123', role: 'manager', name: 'Sara Ali', department: 'Production' },
  { id: '3', username: 'operator', password: 'operator123', role: 'operator', name: 'Mohamed Kamel', department: 'Packing' },
];

export const seedOrders: ProductionOrder[] = [
  {
    id: 'po-001', poNumber: 'PO-2026-001', clientName: 'Zara Global', styleName: 'Classic Denim Jacket',
    styleCode: 'ZG-DJ-4421', orderQty: 5000, cutQty: 5000, laundryQty: 4800, packedQty: 3200, shippedQty: 2000,
    completionPercent: 64, orderDate: '2026-01-15', deliveryDate: '2026-02-28', priority: 'high',
    status: 'packing', notes: 'Special wash required', cautions: ['Delay in laundry - 2 days behind', 'Fabric quality check needed'],
    createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'po-002', poNumber: 'PO-2026-002', clientName: 'H&M Group', styleName: 'Summer Floral Dress',
    styleCode: 'HM-FD-8832', orderQty: 8000, cutQty: 8000, laundryQty: 7500, packedQty: 6000, shippedQty: 6000,
    completionPercent: 75, orderDate: '2026-01-10', deliveryDate: '2026-02-20', priority: 'urgent',
    status: 'shipping', notes: 'Express shipping required', cautions: ['Delivery deadline approaching'],
    createdAt: '2026-01-10T09:00:00Z', updatedAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'po-003', poNumber: 'PO-2026-003', clientName: 'Uniqlo', styleName: 'Slim Fit Chinos',
    styleCode: 'UQ-CH-2210', orderQty: 12000, cutQty: 12000, laundryQty: 10000, packedQty: 7500, shippedQty: 0,
    completionPercent: 62, orderDate: '2026-01-20', deliveryDate: '2026-03-15', priority: 'medium',
    status: 'packing', notes: 'Multiple color variants', cautions: [],
    createdAt: '2026-01-20T07:00:00Z', updatedAt: '2026-02-12T16:00:00Z'
  },
  {
    id: 'po-004', poNumber: 'PO-2026-004', clientName: 'Nike', styleName: 'Performance T-Shirt',
    styleCode: 'NK-PT-5567', orderQty: 20000, cutQty: 20000, laundryQty: 18000, packedQty: 15000, shippedQty: 10000,
    completionPercent: 75, orderDate: '2026-01-05', deliveryDate: '2026-02-25', priority: 'high',
    status: 'shipping', notes: 'Moisture-wicking fabric', cautions: ['Quality issue on batch 3 - re-inspection needed'],
    createdAt: '2026-01-05T08:00:00Z', updatedAt: '2026-02-14T11:00:00Z'
  },
  {
    id: 'po-005', poNumber: 'PO-2026-005', clientName: 'Mango', styleName: 'Linen Blend Shirt',
    styleCode: 'MG-LS-3345', orderQty: 3000, cutQty: 3000, laundryQty: 2500, packedQty: 1000, shippedQty: 0,
    completionPercent: 33, orderDate: '2026-02-01', deliveryDate: '2026-03-20', priority: 'medium',
    status: 'laundry', notes: 'Enzyme wash treatment', cautions: ['Waiting for fabric from supplier'],
    createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-13T13:00:00Z'
  },
  {
    id: 'po-006', poNumber: 'PO-2026-006', clientName: 'Pull&Bear', styleName: 'Oversized Hoodie',
    styleCode: 'PB-OH-7789', orderQty: 6000, cutQty: 6000, laundryQty: 6000, packedQty: 6000, shippedQty: 6000,
    completionPercent: 100, orderDate: '2025-12-20', deliveryDate: '2026-02-10', priority: 'low',
    status: 'completed', notes: 'Fleece lining', cautions: [],
    createdAt: '2025-12-20T08:00:00Z', updatedAt: '2026-02-08T17:00:00Z'
  },
  {
    id: 'po-007', poNumber: 'PO-2026-007', clientName: 'Bershka', styleName: 'Cargo Pants',
    styleCode: 'BK-CP-1123', orderQty: 4500, cutQty: 4000, laundryQty: 2000, packedQty: 500, shippedQty: 0,
    completionPercent: 11, orderDate: '2026-02-10', deliveryDate: '2026-04-01', priority: 'low',
    status: 'in-progress', notes: 'Multiple pockets design', cautions: ['Cut qty below order qty - need fabric'],
    createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-02-15T09:00:00Z'
  },
  {
    id: 'po-008', poNumber: 'PO-2026-008', clientName: 'Adidas', styleName: 'Training Shorts',
    styleCode: 'AD-TS-9901', orderQty: 15000, cutQty: 15000, laundryQty: 14000, packedQty: 12000, shippedQty: 8000,
    completionPercent: 80, orderDate: '2026-01-08', deliveryDate: '2026-02-22', priority: 'urgent',
    status: 'final', notes: 'Three-stripe detail', cautions: ['Final QC pending for last batch', 'Shipping labels need update'],
    createdAt: '2026-01-08T07:30:00Z', updatedAt: '2026-02-16T08:00:00Z'
  },
  {
    id: 'po-009', poNumber: 'PO-2026-009', clientName: 'Massimo Dutti', styleName: 'Wool Blend Coat',
    styleCode: 'MD-WC-4456', orderQty: 2000, cutQty: 2000, laundryQty: 1800, packedQty: 1200, shippedQty: 0,
    completionPercent: 60, orderDate: '2026-01-25', deliveryDate: '2026-03-10', priority: 'high',
    status: 'packing', notes: 'Premium quality required', cautions: ['Button supply delayed', 'Size XL running short'],
    createdAt: '2026-01-25T08:00:00Z', updatedAt: '2026-02-14T15:00:00Z'
  },
  {
    id: 'po-010', poNumber: 'PO-2026-010', clientName: 'Tommy Hilfiger', styleName: 'Polo Shirt Classic',
    styleCode: 'TH-PS-6678', orderQty: 10000, cutQty: 10000, laundryQty: 9500, packedQty: 8500, shippedQty: 5000,
    completionPercent: 85, orderDate: '2026-01-12', deliveryDate: '2026-02-18', priority: 'high',
    status: 'shipping', notes: 'Signature collar detail', cautions: ['Partial shipment approved'],
    createdAt: '2026-01-12T09:00:00Z', updatedAt: '2026-02-16T12:00:00Z'
  },
];

export const seedNotifications: Notification[] = [
  { id: 'n1', type: 'warning', title: 'Delivery Deadline Approaching', message: 'PO-2026-002 (H&M Summer Dress) delivery due in 3 days. Only 75% complete.', poId: 'po-002', read: false, createdAt: '2026-02-17T08:00:00Z' },
  { id: 'n2', type: 'caution', title: 'Laundry Delay', message: 'PO-2026-001 (Zara Denim Jacket) is 2 days behind in laundry section.', poId: 'po-001', read: false, createdAt: '2026-02-16T14:00:00Z' },
  { id: 'n3', type: 'error', title: 'Quality Issue Detected', message: 'Batch 3 of PO-2026-004 (Nike T-Shirt) failed quality inspection. Re-inspection required.', poId: 'po-004', read: false, createdAt: '2026-02-15T11:00:00Z' },
  { id: 'n4', type: 'info', title: 'New Order Received', message: 'PO-2026-007 from Bershka has been created. 4,500 units of Cargo Pants.', poId: 'po-007', read: true, createdAt: '2026-02-10T10:00:00Z' },
  { id: 'n5', type: 'success', title: 'Order Completed', message: 'PO-2026-006 (Pull&Bear Hoodie) has been fully completed and shipped.', poId: 'po-006', read: true, createdAt: '2026-02-08T17:00:00Z' },
  { id: 'n6', type: 'caution', title: 'Material Shortage', message: 'PO-2026-009 (Massimo Dutti Coat) - Button supply delayed. Contact procurement.', poId: 'po-009', read: false, createdAt: '2026-02-14T09:00:00Z' },
  { id: 'n7', type: 'warning', title: 'Cut Quantity Mismatch', message: 'PO-2026-007 cut quantity (4,000) is below order quantity (4,500). Fabric needed.', poId: 'po-007', read: false, createdAt: '2026-02-15T08:00:00Z' },
  { id: 'n8', type: 'info', title: 'Shipping Update', message: 'PO-2026-010 partial shipment dispatched. 5,000 units shipped to Tommy Hilfiger.', poId: 'po-010', read: true, createdAt: '2026-02-16T12:00:00Z' },
];
