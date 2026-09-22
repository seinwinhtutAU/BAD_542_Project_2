import React from 'react';
import { Package, ChevronRight, Clock, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function OrderList({ orders, selectedOrderId, onSelectOrder }) {
  const getBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'CANCELLED_AND_REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <RotateCcw className="w-3 h-3" /> Compensated
          </span>
        );
      case 'COMPENSATING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Compensating
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Recent Orders</h3>
            <p className="text-[11px] text-slate-500">Click to inspect Saga Graph</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md">
          {orders.length}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No orders created yet.
          </div>
        ) : (
          orders.map((order) => {
            const isSelected = selectedOrderId === order.orderId;
            return (
              <div
                key={order.orderId}
                onClick={() => onSelectOrder(order.orderId)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-brand-50/70 border-brand-400 shadow-sm ring-1 ring-brand-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900">{order.orderId}</span>
                  {getBadge(order.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-slate-800">{order.customerName}</span>
                  <span className="font-bold text-slate-900">${order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{order.simulateCourierFailure ? '⚡ Courier Failure Test' : '✓ Normal Dispatch'}</span>
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
