import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  Utensils, 
  CreditCard, 
  Bike, 
  Bell, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function OrderTrackingModal() {
  const { activeOrder, isTrackingModalOpen, setIsTrackingModalOpen } = useOrder();

  if (!isTrackingModalOpen || !activeOrder) return null;

  const isFailed = activeOrder.status === 'CANCELLED_AND_REFUNDED';
  const isDelivering = activeOrder.status === 'OUT_FOR_DELIVERY';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-6 text-white relative ${
          isFailed
            ? 'bg-gradient-to-r from-slate-800 to-slate-900'
            : isDelivering
              ? 'bg-gradient-to-r from-sky-600 to-blue-600'
              : 'bg-gradient-to-r from-sky-500 to-blue-600'
        }`}>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold uppercase tracking-wider text-sky-200 mb-1 block">
            Live Order Tracking
          </span>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {isFailed
              ? 'Order Cancelled & Refunded'
              : isDelivering
                ? 'Courier on the Way'
                : 'Preparing Your Order'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Order <span className="font-mono font-bold text-white">{activeOrder.orderId}</span> • Kyoto Ramen & Izakaya
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* REALISTIC DELIVERY STEPS */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Status
            </span>

            <div className="space-y-2.5">
              {activeOrder.steps?.map((step, idx) => {
                const isStepSuccess = step.status === 'SUCCESS';
                const isStepFailed = step.status === 'FAILED';
                const isStepInProgress = step.status === 'IN_PROGRESS';

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isStepSuccess
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : isStepFailed
                          ? 'bg-rose-50 border-rose-200'
                          : isStepInProgress
                            ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-300'
                            : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isStepSuccess
                          ? 'bg-emerald-500 text-white'
                          : isStepFailed
                            ? 'bg-rose-500 text-white'
                            : isStepInProgress
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-200 text-slate-400'
                      }`}>
                        {isStepSuccess ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isStepFailed ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className={`w-4 h-4 ${isStepInProgress ? 'animate-spin' : ''}`} />
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {step.title}
                        </h4>
                        <p className={`text-xs mt-0.5 ${
                          isStepFailed ? 'text-rose-700 font-medium' : 'text-slate-600'
                        }`}>
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    {step.timestamp && (
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* === WHEN COURIER IS UNAVAILABLE: CLEAN CONSUMER REFUND CARD === */}
          {isFailed && activeOrder.compensations && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-rose-500 text-white rounded-xl shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    No Courier Available in Your Area
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    We could not find an available delivery driver nearby. We have automatically cancelled your order and issued a 100% full refund.
                  </p>
                </div>
              </div>

              {/* 3 Clear Customer Resolutions */}
              <div className="space-y-2 pt-1 text-xs">
                
                {/* 1. Payment Refund */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">Full Refund Issued</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        ${activeOrder.compensations.refund.amount.toFixed(2)} refunded to {activeOrder.paymentMethod}. (Ref: {activeOrder.compensations.refund.refundId})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 bg-emerald-50 rounded">
                    Refunded
                  </span>
                </div>

                {/* 2. Restaurant Order Cancelled */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <Utensils className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">Restaurant Order Cancelled</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Kyoto Ramen kitchen order was cancelled.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold px-1.5 py-0.5 bg-slate-100 rounded">
                    Cancelled
                  </span>
                </div>

                {/* 3. SMS Notification */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <Bell className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">SMS Notification Sent</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Confirmation text delivered to {activeOrder.customerPhone}.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-700 font-bold px-1.5 py-0.5 bg-sky-50 rounded">
                    Sent
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* Ordered Items Summary */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Items Ordered
            </span>
            <div className="space-y-1 text-xs">
              {activeOrder.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-slate-600 py-1">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-100 text-sm">
                <span>Total Amount</span>
                <span className="text-sky-700">${activeOrder.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 truncate max-w-[240px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{activeOrder.deliveryAddress}</span>
          </div>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
