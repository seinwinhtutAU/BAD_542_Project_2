import React from 'react';
import { Bike, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function CourierView() {
  const { orders, assignCourier, failCourier } = useOrder();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
            <Bike className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Courier Dispatch Service</h2>
            <p className="text-[11px] text-slate-500">Service actions to assign driver or trigger courier failure</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          Dispatches: {orders.length}
        </span>
      </div>

      {/* Dispatches List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No courier requests yet. Place an order in the Customer tab.
          </div>
        ) : (
          orders.map((order) => {
            const isFailed = order.status === 'CANCELLED_AND_REFUNDED';
            const isAssigned = order.status === 'OUT_FOR_DELIVERY';
            const canDispatch = order.status === 'PREPARING';
            const isAwaitingKitchen = order.status === 'PAID';

            return (
              <div
                key={order.orderId}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all space-y-3 ${
                  isFailed
                    ? 'border-rose-200 bg-rose-50/20'
                    : isAssigned
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : canDispatch
                        ? 'border-sky-300 ring-1 ring-sky-200 bg-sky-50/20'
                        : 'border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.orderId}</span>
                    <span className="text-xs text-slate-600">• {order.customerName}</span>
                  </div>

                  {isFailed ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-3 h-3" /> Courier Failed (Compensated)
                    </span>
                  ) : isAssigned ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Assigned: {order.driver?.name || 'Driver Alex'}
                    </span>
                  ) : canDispatch ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                      Ready for Action
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Waiting for Restaurant Approval
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-600">
                  <span>Dropoff: <strong>{order.deliveryAddress}</strong></span>
                  <span className="font-bold text-slate-800">${order.grandTotal?.toFixed(2)}</span>
                </div>

                {/* SMALL ACTION BUTTONS */}
                {canDispatch && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Dispatch Action:</span>

                    <div className="flex items-center space-x-2">
                      {/* Small Button 1: Assign Driver */}
                      <button
                        onClick={() => assignCourier(order.orderId)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all flex items-center space-x-1 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Assign Driver</span>
                      </button>

                      {/* Small Button 2: Courier Failed */}
                      <button
                        onClick={() => failCourier(order.orderId)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all flex items-center space-x-1 active:scale-95"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Courier Failed</span>
                      </button>
                    </div>
                  </div>
                )}

                {isAwaitingKitchen && (
                  <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded-lg">
                    ℹ️ Switch to <strong>"Restaurant"</strong> tab and approve the order first to enable courier dispatch.
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
