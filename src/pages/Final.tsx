import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProductionOrder } from '../types';
import { CheckCircle2, Search, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Final() {
  const { orders, updateOrder, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

  const finalOrders = orders.filter(o => ['packing', 'final', 'shipping'].includes(o.status));
  const filtered = finalOrders.filter(o =>
    o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (order: ProductionOrder) => {
    updateOrder(order.id, { status: 'shipping', completionPercent: Math.max(order.completionPercent, 90) });
    setSelectedOrder(null);
  };

  const handleComplete = (order: ProductionOrder) => {
    updateOrder(order.id, { status: 'completed', completionPercent: 100, shippedQty: order.orderQty });
  };

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-100 rounded-xl"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-amber-500" /> Final QC Section
          </h1>
          <p className="text-sm text-gray-500">{filtered.length} orders in final inspection</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-medium">Awaiting QC</p>
          <p className="text-2xl font-bold text-gray-900">{finalOrders.filter(o => o.status === 'final').length}</p>
          <p className="text-xs text-gray-500">orders for inspection</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium">QC Passed</p>
          <p className="text-2xl font-bold text-gray-900">{finalOrders.reduce((s, o) => s + o.packedQty, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">pieces inspected</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-600 font-medium">Ready to Ship</p>
          <p className="text-2xl font-bold text-gray-900">{finalOrders.filter(o => o.status === 'shipping').length}</p>
          <p className="text-xs text-gray-500">orders approved</p>
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders in final QC</h3>
          <p className="text-sm text-gray-500">Orders will appear here after packing is complete.</p>
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
                    {order.status === 'final' && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">QC Pending</span>}
                    {order.status === 'shipping' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">QC Passed</span>}
                  </div>
                  <p className="text-sm text-gray-600">{order.clientName} - {order.styleName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Packed: {order.packedQty.toLocaleString()}</span>
                    <span>Shipped: {order.shippedQty.toLocaleString()}</span>
                    <span className="font-medium text-gray-700">Delivery: {order.deliveryDate}</span>
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
                  {order.status === 'final' && (
                    <button
                      onClick={() => handleApprove(order)}
                      className="px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3" /> Approve QC
                    </button>
                  )}
                  {order.status === 'shipping' && (
                    <button
                      onClick={() => handleComplete(order)}
                      className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      Mark Complete <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${order.completionPercent === 100 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${order.completionPercent}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
