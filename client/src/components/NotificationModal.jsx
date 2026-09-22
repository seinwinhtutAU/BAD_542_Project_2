import React from 'react';
import { X, Bell, RotateCcw, Truck, MessageSquare, Check } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function NotificationModal() {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, markNotificationsAsRead } = useOrder();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-600 text-white rounded-xl">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">SMS & Push Alerts</h3>
              <p className="text-xs text-slate-500">Live customer delivery notices</p>
            </div>
          </div>
          <button
            onClick={() => {
              markNotificationsAsRead();
              setIsNotificationsOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No alerts received yet.</p>
              <p className="text-[11px] text-slate-400">Place an order to receive SMS notifications.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isRefund = notif.type === 'REFUND';

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                    isRefund
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-sky-50/60 border-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg text-white ${
                        isRefund ? 'bg-amber-500' : 'bg-sky-600'
                      }`}>
                        {isRefund ? <RotateCcw className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-bold text-slate-900">{notif.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{notif.time}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed pl-1">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                    <span>Order: <strong className="text-slate-700">{notif.orderId}</strong></span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Delivered to Phone
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={markNotificationsAsRead}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800"
          >
            Mark all as read
          </button>
          <button
            onClick={() => {
              markNotificationsAsRead();
              setIsNotificationsOpen(false);
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
