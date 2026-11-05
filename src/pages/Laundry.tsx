import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProductionOrder } from '../types';
import { Droplets, Search, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

export default function Laundry() {
  const { orders, updateOrder, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [laundryInput, setLaundryInput] = useState(0);

  const laundryOrders = orders.filter(o => ['in-progress', 'laundry', 'pending'].includes(o.status));
  const filtered = laundryOrders.filter(o =>
    o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateLaundry = () => {
    if (!selectedOrder) return;
    const newLaundryQty = Math.min(laundryInput, selectedOrder.cutQty);
    const completionPercent = Math.round((newLaundryQty / selectedOrder.orderQty) * 50);
    updateOrder(selectedOrder.id, {
      laundryQty: newLaundryQty,
      status: newLaundryQty > 0 ? 'laundry' : selectedOrder.status,
      completionPercent: Math.max(selectedOrder.completionPercent, completionPercent),
    });
    setSelectedOrder(null);
  };

  const handleMoveToPacking = (order: ProductionOrder) => {
    updateOrder(order.id, { status: 'packing', completionPercent: Math.max(order.completionPercent, 50) });
  };

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-100 rounded-xl"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-500" /> Laundry Section
          </h1>
          <p className="text-sm text-gray-500">{filtered.length} orders in laundry pipeline</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-64" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
          <p className="text-xs text-cyan-600 font-medium">In Laundry</p>
          <p className="text-2xl font-bold text-gray-900">{laundryOrders.length}</p>
          <p className="text-xs text-gray-500">{laundryOrders.reduce((s, o) => s + o.cutQty, 0).toLocaleString()} total pieces</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium">Processed</p>
          <p className="text-2xl font-bold text-gray-900">{laundryOrders.reduce((s, o) => s + o.laundryQty, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces completed wash</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-medium">Pending Wash</p>
          <p className="text-2xl font-bold text-gray-900">{laundryOrders.reduce((s, o) => s + (o.cutQty - o.laundryQty), 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces waiting</p>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders in laundry</h3>
          <p className="text-sm text-gray-500">Orders will appear here when they reach the laundry stage.</p>
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
                    <span>Ordered: {order.orderQty.toLocaleString()}</span>
                    <span>Cut: {order.cutQty.toLocaleString()}</span>
                    <span className="text-cyan-600 font-medium">Washed: {order.laundryQty.toLocaleString()}</span>
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
                    <div className="text-lg font-bold text-gray-900">{Math.round((order.laundryQty / order.cutQty) * 100)}%</div>
                    <div className="text-xs text-gray-500">washed</div>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(order); setLaundryInput(order.laundryQty); }}
                    className="px-3 py-2 bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-medium rounded-lg hover:bg-cyan-100 transition"
                  >
                    Update
                  </button>
                  {order.laundryQty >= order.cutQty && order.status !== 'packing' && (
                    <button
                      onClick={() => handleMoveToPacking(order)}
                      className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      To Packing <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-cyan-500 transition-all" style={{ width: `${Math.round((order.laundryQty / order.cutQty) * 100)}%` }}></div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Laundry - {selectedOrder.poNumber}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pieces Washed</label>
                <input type="number" value={laundryInput} onChange={e => setLaundryInput(Number(e.target.value))} max={selectedOrder.cutQty} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <p className="text-xs text-gray-500 mt-1">Max: {selectedOrder.cutQty.toLocaleString()} (cut quantity)</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3">
                <p className="text-xs text-cyan-600">Progress: {Math.round((laundryInput / selectedOrder.cutQty) * 100)}% washed</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleUpdateLaundry} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
