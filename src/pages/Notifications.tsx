import React from 'react';
import { useData } from '../context/DataContext';
import { Bell, AlertTriangle, Info, CheckCircle2, XCircle, ShieldAlert, Trash2, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, isLoading } = useData();

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"></div><div className="h-64 bg-gray-100 rounded-xl"></div></div>;

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'caution': return <ShieldAlert className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'caution': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" /> Notifications
          </h1>
          <p className="text-sm text-gray-500">{unread.length} unread of {notifications.length} total</p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg hover:bg-blue-100 transition"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
          <p className="text-sm text-gray-500">You're all caught up! Notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Unread ({unread.length})</h3>
              <div className="space-y-2">
                {unread.map(notification => (
                  <div key={notification.id} className={`rounded-xl border p-4 ${getBgColor(notification.type)} transition hover:shadow-sm`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => markNotificationRead(notification.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Mark as read">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteNotification(notification.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Earlier ({read.length})</h3>
              <div className="space-y-2">
                {read.map(notification => (
                  <div key={notification.id} className="rounded-xl border border-gray-200 bg-white p-4 opacity-75 hover:opacity-100 transition">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-700">{notification.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <button onClick={() => deleteNotification(notification.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
