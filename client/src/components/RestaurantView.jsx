import React from 'react';
import { Utensils, CheckCircle2, XCircle, ChefHat } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function RestaurantView() {
  const { orders, confirmRestaurantOrder } = useOrder();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Restaurant Kitchen Portal</h2>
            <p className="text-[11px] text-slate-500">Approve incoming customer orders and prepare food</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          Tickets: {orders.length}
        </span>
      </div>

      {/* Kitchen Orders List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No kitchen tickets received yet. Go to Customer tab and place an order.
          </div>
        ) : (
          orders.map((order) => {
            const isCancelled = order.status === 'CANCELLED_AND_REFUNDED';
            const isPreparing = order.status === 'PREPARING';
            const isDispatched = order.status === 'OUT_FOR_DELIVERY';
            const isPendingAccept = order.status === 'PAID';

            return (
              <div
                key={order.orderId}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all space-y-3 ${
                  isCancelled
                    ? 'border-rose-200 bg-rose-50/20'
                    : isPreparing
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.orderId}</span>
                    <span className="text-xs text-slate-600 font-medium">• {order.customerName}</span>
                  </div>

                  {isCancelled ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-3 h-3" /> Cancelled (Courier Failed)
                    </span>
                  ) : isDispatched ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Picked Up by Courier
                    </span>
                  ) : isPreparing ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      <ChefHat className="w-3 h-3" /> Food Cooking
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                      Awaiting Kitchen Approval
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span>• {item.quantity}x {item.name}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* RESTAURANT ACTION BUTTON */}
                {isPendingAccept && !isCancelled && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Order received and paid.</span>
                    <button
                      onClick={() => confirmRestaurantOrder(order.orderId)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center space-x-1.5 active:scale-95"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Approve Order</span>
                    </button>
                  </div>
                )}

                {isPreparing && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg">
                    ✓ Order approved. Switch to <strong>"Courier"</strong> tab to assign driver or report failure.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
