import React from 'react';
import { Bell, Check } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function NotificationView() {
  const { notifications } = useOrder();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Notification Service</h2>
            <p className="text-[11px] text-slate-500">Customer notifications and delivery alerts</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg">
          Dispatched: {notifications.length}
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No notifications dispatched yet.
          </div>
        ) : (
          notifications.map((notif) => {
            const isRefund = notif.type === 'REFUND';

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all space-y-2.5 ${
                  isRefund ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({notif.orderId})</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    <Check className="w-3 h-3" /> Sent
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono">
                  "{notif.message}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Recipient: <strong className="text-slate-700">{notif.recipient}</strong></span>
                  <span>{notif.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
