import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProductionOrder } from '../types';
import { Package, Search, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

export default function Packing() {
  const { orders, updateOrder, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [packedInput, setPackedInput] = useState(0);

  const packingOrders = orders.filter(o => ['laundry', 'packing', 'final'].includes(o.status));
  const filtered = packingOrders.filter(o =>
    o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdatePacked = () => {
    if (!selectedOrder) return;
    const newPackedQty = Math.min(packedInput, selectedOrder.laundryQty);
    const completionPercent = Math.round((newPackedQty / selectedOrder.orderQty) * 80);
    updateOrder(selectedOrder.id, {
      packedQty: newPackedQty,
      status: newPackedQty >= selectedOrder.laundryQty ? 'final' : 'packing',
      completionPercent: Math.max(selectedOrder.completionPercent, completionPercent),
    });
    setSelectedOrder(null);
  };

  const handleMoveToFinal = (order: ProductionOrder) => {
    updateOrder(order.id, { status: 'final', completionPercent: Math.max(order.completionPercent, 80) });
  };

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-100 rounded-xl"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-violet-500" /> Packing Section
          </h1>
          <p className="text-sm text-gray-500">{filtered.length} orders in packing pipeline</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-64" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="text-xs text-violet-600 font-medium">In Packing</p>
          <p className="text-2xl font-bold text-gray-900">{packingOrders.length}</p>
          <p className="text-xs text-gray-500">orders to pack</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium">Packed</p>
          <p className="text-2xl font-bold text-gray-900">{packingOrders.reduce((s, o) => s + o.packedQty, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces packed</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-medium">Remaining</p>
          <p className="text-2xl font-bold text-gray-900">{packingOrders.reduce((s, o) => s + (o.laundryQty - o.packedQty), 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces to pack</p>
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders to pack</h3>
          <p className="text-sm text-gray-500">Orders will appear here after laundry processing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{order.poNumber}</span>
                    {order.cautions.length > 0 && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {order.priority === 'urgent' && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">Urgent</span>}
                  </div>
                  <p className="text-sm text-gray-600">{order.clientName} - {order.styleName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>From Laundry: {order.laundryQty.toLocaleString()}</span>
                    <span className="text-violet-600 font-medium">Packed: {order.packedQty.toLocaleString()}</span>
                    <span>Remaining: {(order.laundryQty - order.packedQty).toLocaleString()}</span>
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
                    <div className="text-lg font-bold text-gray-900">{Math.round((order.packedQty / order.laundryQty) * 100)}%</div>
                    <div className="text-xs text-gray-500">packed</div>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(order); setPackedInput(order.packedQty); }}
                    className="px-3 py-2 bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium rounded-lg hover:bg-violet-100 transition"
                  >
                    Update
                  </button>
                  {order.packedQty >= order.laundryQty && order.status !== 'final' && (
                    <button
                      onClick={() => handleMoveToFinal(order)}
                      className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      To Final <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${Math.round((order.packedQty / order.laundryQty) * 100)}%` }}></div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Packing - {selectedOrder.poNumber}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pieces Packed</label>
                <input type="number" value={packedInput} onChange={e => setPackedInput(Number(e.target.value))} max={selectedOrder.laundryQty} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <p className="text-xs text-gray-500 mt-1">Max: {selectedOrder.laundryQty.toLocaleString()} (from laundry)</p>
              </div>
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="text-xs text-violet-600">Progress: {Math.round((packedInput / selectedOrder.laundryQty) * 100)}% packed</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleUpdatePacked} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
