import React from 'react';
import { CreditCard, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function PaymentView() {
  const { orders } = useOrder();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Payment Service</h2>
            <p className="text-[11px] text-slate-500">Transaction captures and automatic refund compensation logs</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
          Active Gateway
        </span>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No payment records yet. Place an order in the Customer tab.
          </div>
        ) : (
          orders.map((order) => {
            const isRefunded = order.status === 'CANCELLED_AND_REFUNDED';
            const refundInfo = order.compensations?.refund;

            return (
              <div
                key={order.orderId}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all space-y-3 ${
                  isRefunded ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.orderId}</span>
                    <span className="text-xs text-slate-600">• {order.customerName}</span>
                  </div>

                  {isRefunded ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      <RotateCcw className="w-3 h-3" /> Refunded to Card
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Payment Captured
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Original Charge:</span>
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{order.paymentMethod || 'Credit Card •••• 4242'}</span>
                      <span className="text-emerald-700 font-bold">${order.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>

                  {isRefunded && refundInfo && (
                    <div className="p-2.5 bg-white rounded-xl border border-amber-200 shadow-2xs">
                      <span className="text-[10px] text-amber-700 uppercase font-bold block mb-0.5">Compensation Refund:</span>
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span className="font-mono text-[11px]">ID: {refundInfo.refundId}</span>
                        <span className="text-amber-800 font-bold">-${refundInfo.amount?.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
