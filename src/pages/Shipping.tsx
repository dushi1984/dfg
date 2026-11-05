import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProductionOrder } from '../types';
import { Truck, Search, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

export default function Shipping() {
  const { orders, updateOrder, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [shippedInput, setShippedInput] = useState(0);

  const shippingOrders = orders.filter(o => ['final', 'shipping', 'completed'].includes(o.status));
  const filtered = shippingOrders.filter(o =>
    o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateShipped = () => {
    if (!selectedOrder) return;
    const newShippedQty = Math.min(shippedInput, selectedOrder.packedQty);
    const completionPercent = Math.round((newShippedQty / selectedOrder.orderQty) * 100);
    updateOrder(selectedOrder.id, {
      shippedQty: newShippedQty,
      status: newShippedQty >= selectedOrder.orderQty ? 'completed' : 'shipping',
      completionPercent: Math.max(selectedOrder.completionPercent, completionPercent),
    });
    setSelectedOrder(null);
  };

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-100 rounded-xl"></div></div>;

  const totalToShip = shippingOrders.reduce((s, o) => s + o.packedQty, 0);
  const totalShipped = shippingOrders.reduce((s, o) => s + o.shippedQty, 0);
  const pendingShipment = totalToShip - totalShipped;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-500" /> Shipping Department
          </h1>
          <p className="text-sm text-gray-500">{filtered.length} orders in shipping pipeline</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-600 font-medium">Ready to Ship</p>
          <p className="text-2xl font-bold text-gray-900">{totalToShip.toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces available</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium">Shipped</p>
          <p className="text-2xl font-bold text-gray-900">{totalShipped.toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces dispatched</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{pendingShipment.toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces to ship</p>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="text-xs text-violet-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'completed').length}</p>
          <p className="text-xs text-gray-500">orders fully shipped</p>
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" /> Upcoming Deliveries
        </h3>
        <div className="flex flex-wrap gap-2">
          {shippingOrders.filter(o => o.status !== 'completed').sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()).slice(0, 5).map(order => {
            const daysLeft = Math.ceil((new Date(order.deliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (
              <div key={order.id} className={`px-3 py-2 rounded-lg border text-xs ${daysLeft <= 3 ? 'bg-red-50 border-red-200 text-red-700' : daysLeft <= 7 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                <span className="font-medium">{order.poNumber}</span>
                <span className="ml-2">{order.deliveryDate}</span>
                <span className="ml-1">({daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders to ship</h3>
          <p className="text-sm text-gray-500">Orders will appear here after final QC approval.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className={`bg-white rounded-xl border p-4 hover:shadow-md transition ${order.status === 'completed' ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{order.poNumber}</span>
                    {order.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {order.cautions.length > 0 && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-sm text-gray-600">{order.clientName} - {order.styleName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Packed: {order.packedQty.toLocaleString()}</span>
                    <span className="text-emerald-600 font-medium">Shipped: {order.shippedQty.toLocaleString()}</span>
                    <span>Delivery: {order.deliveryDate}</span>
                  </div>
                  {order.cautions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {order.cautions.map((c, i) => (
                        <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center mr-2">
                    <div className="text-lg font-bold text-gray-900">{order.completionPercent}%</div>
                    <div className="text-xs text-gray-500">complete</div>
                  </div>
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => { setSelectedOrder(order); setShippedInput(order.shippedQty); }}
                      className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-lg hover:bg-emerald-100 transition"
                    >
                      Update Shipment
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${order.completionPercent === 100 ? 'bg-green-500' : 'bg-emerald-500'}`} style={{ width: `${order.completionPercent}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Shipment - {selectedOrder.poNumber}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pieces Shipped</label>
                <input type="number" value={shippedInput} onChange={e => setShippedInput(Number(e.target.value))} max={selectedOrder.packedQty} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <p className="text-xs text-gray-500 mt-1">Max: {selectedOrder.packedQty.toLocaleString()} (packed quantity)</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-600">
                  Shipment progress: {Math.round((shippedInput / selectedOrder.orderQty) * 100)}% of order
                  {shippedInput >= selectedOrder.orderQty && ' - Order will be marked complete!'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleUpdateShipped} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
