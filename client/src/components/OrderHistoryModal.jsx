import React from 'react';
import { X, Clock, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function OrderHistoryModal({ isOpen, onClose }) {
  const { orders, setActiveOrder, setIsTrackingModalOpen } = useOrder();

  if (!isOpen) return null;

  const handleSelectOrder = (order) => {
    setActiveOrder(order);
    onClose();
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-600 text-white rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Past Orders</h3>
              <p className="text-xs text-slate-500">Track and review previous orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No order history found</p>
            </div>
          ) : (
            orders.map((order) => {
              const isCompensated = order.status === 'CANCELLED_AND_REFUNDED';
              const isDelivering = order.status === 'OUT_FOR_DELIVERY';

              return (
                <div
                  key={order.orderId}
                  onClick={() => handleSelectOrder(order)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                    isCompensated
                      ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.orderId}</span>
                    {isCompensated ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        <RotateCcw className="w-3 h-3" /> Refunded & Cancelled
                      </span>
                    ) : isDelivering ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Out for Delivery
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                        Processing
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{order.items?.length || 0} items • Kyoto Ramen</span>
                    <span className="font-bold text-slate-900">${order.grandTotal?.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span>{order.createdAt}</span>
                    <span className="text-sky-600 font-semibold flex items-center gap-0.5">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
