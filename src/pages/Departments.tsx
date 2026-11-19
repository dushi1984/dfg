import React from 'react';
import { useData } from '../context/DataContext';
import { Building2, Droplets, Package, CheckCircle2, Truck, Scissors } from 'lucide-react';

export default function Departments() {
  const { orders, isLoading } = useData();

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-100 rounded-xl"></div></div>;

  const departments = [
    {
      name: 'Cutting Department',
      icon: <Scissors className="w-6 h-6" />,
      color: 'rose',
      description: 'Fabric cutting and pattern preparation',
      stats: {
        totalOrders: orders.length,
        totalPieces: orders.reduce((s, o) => s + o.cutQty, 0),
        activeOrders: orders.filter(o => ['pending', 'in-progress'].includes(o.status)).length,
      }
    },
    {
      name: 'Laundry Department',
      icon: <Droplets className="w-6 h-6" />,
      color: 'cyan',
      description: 'Washing, dyeing, and fabric treatment',
      stats: {
        totalOrders: orders.filter(o => ['in-progress', 'laundry'].includes(o.status)).length,
        totalPieces: orders.reduce((s, o) => s + o.laundryQty, 0),
        activeOrders: orders.filter(o => o.status === 'laundry').length,
      }
    },
    {
      name: 'Packing Department',
      icon: <Package className="w-6 h-6" />,
      color: 'violet',
      description: 'Folding, tagging, and packaging',
      stats: {
        totalOrders: orders.filter(o => o.status === 'packing').length,
        totalPieces: orders.reduce((s, o) => s + o.packedQty, 0),
        activeOrders: orders.filter(o => o.status === 'packing').length,
      }
    },
    {
      name: 'Final QC Department',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'amber',
      description: 'Quality inspection and approval',
      stats: {
        totalOrders: orders.filter(o => o.status === 'final').length,
        totalPieces: orders.reduce((s, o) => s + o.packedQty, 0),
        activeOrders: orders.filter(o => o.status === 'final').length,
      }
    },
    {
      name: 'Shipping Department',
      icon: <Truck className="w-6 h-6" />,
      color: 'emerald',
      description: 'Dispatch and delivery coordination',
      stats: {
        totalOrders: orders.filter(o => ['shipping', 'completed'].includes(o.status)).length,
        totalPieces: orders.reduce((s, o) => s + o.shippedQty, 0),
        activeOrders: orders.filter(o => o.status === 'shipping').length,
      }
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'bg-rose-100 text-rose-600' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'bg-cyan-100 text-cyan-600' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', icon: 'bg-violet-100 text-violet-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'bg-amber-100 text-amber-600' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-emerald-100 text-emerald-600' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-gray-600" /> Factory Departments
        </h1>
        <p className="text-sm text-gray-500">Overview of all factory departments and their current workload</p>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map(dept => {
          const colors = colorMap[dept.color];
          return (
            <div key={dept.name} className={`rounded-xl border ${colors.border} ${colors.bg} p-6 hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}>
                  {dept.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${colors.text}`}>{dept.name}</h3>
                  <p className="text-xs text-gray-500">{dept.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{dept.stats.totalOrders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{dept.stats.totalPieces.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Pieces</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{dept.stats.activeOrders}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Flow */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Production Flow Overview</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {departments.map((dept, i) => {
            const colors = colorMap[dept.color];
            return (
              <React.Fragment key={dept.name}>
                <div className={`flex-1 w-full rounded-lg border ${colors.border} ${colors.bg} p-4 text-center`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${colors.icon}`}>
                    {dept.icon}
                  </div>
                  <p className={`text-xs font-medium ${colors.text}`}>{dept.name.replace(' Department', '')}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{dept.stats.totalPieces.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">pieces</p>
                </div>
                {i < departments.length - 1 && (
                  <div className="hidden md:flex items-center text-gray-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Department Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Department</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Total Orders</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Total Pieces</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Active Orders</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => {
                const capacity = Math.round((dept.stats.activeOrders / Math.max(dept.stats.totalOrders, 1)) * 100);
                return (
                  <tr key={dept.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{dept.stats.totalOrders}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{dept.stats.totalPieces.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{dept.stats.activeOrders}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${capacity}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{capacity}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
