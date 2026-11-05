import React from 'react';
import { useData } from '../context/DataContext';
import { Package, Droplets, CheckCircle2, Truck, AlertTriangle, TrendingUp, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { orders, notifications, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const inProgressOrders = orders.filter(o => !['completed', 'pending'].includes(o.status)).length;
  const totalPieces = orders.reduce((sum, o) => sum + o.orderQty, 0);
  const totalPacked = orders.reduce((sum, o) => sum + o.packedQty, 0);
  const totalShipped = orders.reduce((sum, o) => sum + o.shippedQty, 0);
  const avgCompletion = Math.round(orders.reduce((sum, o) => sum + o.completionPercent, 0) / totalOrders);
  const urgentOrders = orders.filter(o => o.priority === 'urgent' && o.status !== 'completed').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#94a3b8' },
    { name: 'In Progress', value: orders.filter(o => o.status === 'in-progress').length, color: '#3b82f6' },
    { name: 'Laundry', value: orders.filter(o => o.status === 'laundry').length, color: '#06b6d4' },
    { name: 'Packing', value: orders.filter(o => o.status === 'packing').length, color: '#8b5cf6' },
    { name: 'Final QC', value: orders.filter(o => o.status === 'final').length, color: '#f59e0b' },
    { name: 'Shipping', value: orders.filter(o => o.status === 'shipping').length, color: '#10b981' },
    { name: 'Completed', value: completedOrders, color: '#22c55e' },
  ].filter(d => d.value > 0);

  const departmentData = [
    { name: 'Cutting', pieces: orders.reduce((s, o) => s + o.cutQty, 0) },
    { name: 'Laundry', pieces: orders.reduce((s, o) => s + o.laundryQty, 0) },
    { name: 'Packing', pieces: totalPacked },
    { name: 'Shipping', pieces: totalShipped },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package className="w-5 h-5" />} label="Total Orders" value={totalOrders} sublabel={`${inProgressOrders} in progress`} color="blue" />
        <StatCard icon={<Target className="w-5 h-5" />} label="Avg Completion" value={`${avgCompletion}%`} sublabel={`${completedOrders} completed`} color="emerald" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Pieces" value={totalPieces.toLocaleString()} sublabel={`${totalPacked.toLocaleString()} packed`} color="violet" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Urgent Orders" value={urgentOrders} sublabel={`${unreadNotifications} notifications`} color="amber" />
      </div>

      {/* Pipeline Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Production Pipeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PipelineCard icon={<Droplets className="w-5 h-5" />} label="Laundry" count={orders.filter(o => o.status === 'laundry').length} pieces={orders.reduce((s, o) => s + (o.cutQty - o.laundryQty), 0)} color="cyan" />
          <PipelineCard icon={<Package className="w-5 h-5" />} label="Packing" count={orders.filter(o => o.status === 'packing').length} pieces={totalPacked} color="violet" />
          <PipelineCard icon={<CheckCircle2 className="w-5 h-5" />} label="Final QC" count={orders.filter(o => o.status === 'final').length} pieces={totalPacked - totalShipped} color="amber" />
          <PipelineCard icon={<Truck className="w-5 h-5" />} label="Shipping" count={orders.filter(o => o.status === 'shipping').length} pieces={totalShipped} color="emerald" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Throughput */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Department Throughput</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip formatter={(value: number) => [value.toLocaleString() + ' pcs', 'Pieces']} />
              <Bar dataKey="pieces" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                  <span className="ml-auto font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentOrders.map(order => (
            <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
              <div className={`w-2 h-2 rounded-full ${
                order.priority === 'urgent' ? 'bg-red-500' :
                order.priority === 'high' ? 'bg-orange-500' :
                order.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{order.poNumber} - {order.styleName}</p>
                <p className="text-xs text-gray-500">{order.clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{order.completionPercent}%</p>
                <p className="text-xs text-gray-500 capitalize">{order.status}</p>
              </div>
              <div className="w-24 hidden sm:block">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${order.completionPercent}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sublabel, color }: { icon: React.ReactNode; label: string; value: string | number; sublabel: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  const iconColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    violet: 'bg-violet-100 text-violet-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium opacity-80">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs opacity-70 mt-1">{sublabel}</p>
    </div>
  );
}

function PipelineCard({ icon, label, count, pieces, color }: { icon: React.ReactNode; label: string; count: number; pieces: number; color: string }) {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  };
  const iconBg: Record<string, string> = {
    cyan: 'bg-cyan-100',
    violet: 'bg-violet-100',
    amber: 'bg-amber-100',
    emerald: 'bg-emerald-100',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg[color]}`}>{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{count} <span className="text-xs font-normal text-gray-500">orders</span></p>
      <p className="text-xs text-gray-500 mt-1">{pieces.toLocaleString()} pieces</p>
    </div>
  );
}
