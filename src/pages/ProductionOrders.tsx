import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProductionOrder } from '../types';
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, AlertTriangle } from 'lucide-react';

const emptyOrder: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'> = {
  poNumber: '', clientName: '', styleName: '', styleCode: '', orderQty: 0, cutQty: 0,
  laundryQty: 0, packedQty: 0, shippedQty: 0, completionPercent: 0,
  orderDate: new Date().toISOString().split('T')[0], deliveryDate: '', priority: 'medium',
  status: 'pending', notes: '', cautions: [],
};

export default function ProductionOrders() {
  const { orders, addOrder, updateOrder, deleteOrder, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<ProductionOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.styleName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchPriority = filterPriority === 'all' || o.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleSave = () => {
    if (!editingOrder) return;
    if (editId) {
      updateOrder(editId, editingOrder);
    } else {
      addOrder(editingOrder);
    }
    setShowModal(false);
    setEditingOrder(null);
    setEditId(null);
  };

  const handleEdit = (order: ProductionOrder) => {
    setEditingOrder({ ...order });
    setEditId(order.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteOrder(id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Production Orders</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {orders.length} orders</p>
        </div>
        <button
          onClick={() => { setEditingOrder({ ...emptyOrder, poNumber: `PO-2026-${String(orders.length + 1).padStart(3, '0')}` }); setEditId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="laundry">Laundry</option>
          <option value="packing">Packing</option>
          <option value="final">Final QC</option>
          <option value="shipping">Shipping</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">PO Number</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Style</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Order Qty</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Packed</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Progress</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Priority</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {order.cautions.length > 0 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className="font-medium text-gray-900">{order.poNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.clientName}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{order.styleName}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{order.orderQty.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600 hidden lg:table-cell">{order.packedQty.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${order.completionPercent === 100 ? 'bg-green-500' : order.completionPercent > 60 ? 'bg-blue-500' : order.completionPercent > 30 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${order.completionPercent}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{order.completionPercent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PriorityBadge priority={order.priority} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setShowDetail(order)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(order)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(order.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && editingOrder && (
        <Modal title={editId ? 'Edit Order' : 'New Production Order'} onClose={() => { setShowModal(false); setEditingOrder(null); setEditId(null); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="PO Number" value={editingOrder.poNumber} onChange={v => setEditingOrder({ ...editingOrder, poNumber: v })} />
            <Input label="Client Name" value={editingOrder.clientName} onChange={v => setEditingOrder({ ...editingOrder, clientName: v })} />
            <Input label="Style Name" value={editingOrder.styleName} onChange={v => setEditingOrder({ ...editingOrder, styleName: v })} />
            <Input label="Style Code" value={editingOrder.styleCode} onChange={v => setEditingOrder({ ...editingOrder, styleCode: v })} />
            <Input label="Order Qty" type="number" value={String(editingOrder.orderQty)} onChange={v => setEditingOrder({ ...editingOrder, orderQty: Number(v) })} />
            <Input label="Cut Qty" type="number" value={String(editingOrder.cutQty)} onChange={v => setEditingOrder({ ...editingOrder, cutQty: Number(v) })} />
            <Input label="Laundry Qty" type="number" value={String(editingOrder.laundryQty)} onChange={v => setEditingOrder({ ...editingOrder, laundryQty: Number(v) })} />
            <Input label="Packed Qty" type="number" value={String(editingOrder.packedQty)} onChange={v => setEditingOrder({ ...editingOrder, packedQty: Number(v) })} />
            <Input label="Shipped Qty" type="number" value={String(editingOrder.shippedQty)} onChange={v => setEditingOrder({ ...editingOrder, shippedQty: Number(v) })} />
            <Input label="Order Date" type="date" value={editingOrder.orderDate} onChange={v => setEditingOrder({ ...editingOrder, orderDate: v })} />
            <Input label="Delivery Date" type="date" value={editingOrder.deliveryDate} onChange={v => setEditingOrder({ ...editingOrder, deliveryDate: v })} />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select value={editingOrder.priority} onChange={e => setEditingOrder({ ...editingOrder, priority: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={editingOrder.status} onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="laundry">Laundry</option><option value="packing">Packing</option><option value="final">Final QC</option><option value="shipping">Shipping</option><option value="completed">Completed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea value={editingOrder.notes} onChange={e => setEditingOrder({ ...editingOrder, notes: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Cautions (comma separated)</label>
              <input value={editingOrder.cautions.join(', ')} onChange={e => setEditingOrder({ ...editingOrder, cautions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter cautions..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => { setShowModal(false); setEditingOrder(null); setEditId(null); }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">{editId ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <Modal title={`Order ${showDetail.poNumber}`} onClose={() => setShowDetail(null)}>
          <OrderDetail order={showDetail} />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Modal title="Delete Order" onClose={() => setDeleteConfirm(null)}>
          <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this order? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OrderDetail({ order }: { order: ProductionOrder }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Client" value={order.clientName} />
        <DetailItem label="Style" value={order.styleName} />
        <DetailItem label="Style Code" value={order.styleCode} />
        <DetailItem label="Priority" value={order.priority} />
        <DetailItem label="Order Date" value={order.orderDate} />
        <DetailItem label="Delivery Date" value={order.deliveryDate} />
      </div>
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Production Progress</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ProgressItem label="Ordered" value={order.orderQty} />
          <ProgressItem label="Cut" value={order.cutQty} />
          <ProgressItem label="Laundry" value={order.laundryQty} />
          <ProgressItem label="Packed" value={order.packedQty} />
          <ProgressItem label="Shipped" value={order.shippedQty} />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Overall Completion</span>
            <span className="font-medium text-gray-900">{order.completionPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${order.completionPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${order.completionPercent}%` }}></div>
          </div>
        </div>
      </div>
      {order.cautions.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Cautions</h4>
          <ul className="space-y-1">
            {order.cautions.map((c, i) => (
              <li key={i} className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">{c}</li>
            ))}
          </ul>
        </div>
      )}
      {order.notes && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Notes</h4>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 capitalize">{value}</p>
    </div>
  );
}

function ProgressItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-lg font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'pending': 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-blue-100 text-blue-700',
    'laundry': 'bg-cyan-100 text-cyan-700',
    'packing': 'bg-violet-100 text-violet-700',
    'final': 'bg-amber-100 text-amber-700',
    'shipping': 'bg-emerald-100 text-emerald-700',
    'completed': 'bg-green-100 text-green-700',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-3 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Filter className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
      <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>
  );
}
