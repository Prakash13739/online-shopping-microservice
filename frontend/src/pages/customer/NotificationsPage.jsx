import React from 'react';
import { Bell, CheckCheck, Package, Sparkles } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-400" /> Notifications Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Real-time delivery alerts, order status updates, and promotional notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white btn-primary self-start sm:self-auto shadow-md"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-4xl p-16 text-center glass-card space-y-3">
          <Bell className="w-14 h-14 text-slate-500 mx-auto" />
          <h3 className="text-lg font-black text-white">No Notifications</h3>
          <p className="text-xs text-slate-400 font-medium">You are all caught up with your orders and updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
              className={`p-5 rounded-3xl transition-all flex items-start justify-between gap-4 cursor-pointer ${
                notif.isRead
                  ? 'glass opacity-70'
                  : 'glass-card border-purple-500/40 bg-purple-950/20 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    notif.isRead ? 'glass text-slate-400' : 'bg-purple-600 text-white shadow-md'
                  }`}
                >
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 block mt-2 font-mono">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notif.id);
                  }}
                  className="text-xs font-bold text-purple-300 hover:text-white whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
