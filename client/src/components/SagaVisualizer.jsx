import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  CreditCard, 
  UtensilsCrossed, 
  Truck, 
  Bell, 
  ShieldAlert, 
  CheckCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function SagaVisualizer({ order }) {
  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Order Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Create an order or select an existing order from the list to visualize the live Saga lifecycle and Azure Service Bus compensations.
        </p>
      </div>
    );
  }

  // Derive stage statuses
  const isCreated = true;
  const isPaid = order.timeline.some(t => t.stage === 'PAYMENT_PROCESSED');
  const isKitchenConfirmed = order.timeline.some(t => t.stage === 'RESTAURANT_CONFIRMED');
  const isCourierAssigned = order.timeline.some(t => t.stage === 'COURIER_ASSIGNED');
  const isCourierFailed = order.timeline.some(t => t.stage === 'COURIER_ASSIGNMENT_FAILED');
  
  // Compensations
  const isPaymentRefunded = order.compensations?.paymentRefunded;
  const isRestaurantCancelled = order.compensations?.restaurantCancelled;
  const isCustomerNotified = order.compensations?.customerNotified;
  const isOrderCompensated = order.status === 'CANCELLED_AND_REFUNDED';

  const getStatusBadge = () => {
    switch (order.status) {
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">Completed Successfully</span>;
      case 'CANCELLED_AND_REFUNDED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold">Compensated & Refunded</span>;
      case 'COMPENSATING':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Running Compensations...</span>;
      default:
        return <span className="bg-brand-100 text-brand-800 border border-brand-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Processing Saga...</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base font-bold text-slate-900">Saga Execution Graph</h2>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
              {order.orderId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer: <strong className="text-slate-700">{order.customerName}</strong> ({order.customerPhone}) • Amount: <strong className="text-slate-700">${order.totalAmount?.toFixed(2)}</strong>
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="p-6 space-y-6">

        {/* FORWARD FLOW NODES */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Forward Order Flow
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Azure Service Bus Topic: <code className="text-brand-700">delivery-saga-topic</code></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Step 1: Order Created */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isCreated ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-emerald-500 text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Order Service</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Order Created</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Payload published to Azure Service Bus</p>
            </div>

            {/* Step 2: Payment Processed */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isPaid 
                ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-200' 
                : 'bg-slate-50/60 border-slate-200 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isPaid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'text-emerald-700' : 'text-slate-400'}`}>
                  Payment Service
                </span>
              </div>
              <h4 className={`text-xs font-bold ${isPaid ? 'text-slate-900' : 'text-slate-400'}`}>
                Payment Captured
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isPaid ? `Charged $${order.totalAmount?.toFixed(2)}` : 'Pending order event...'}
              </p>
            </div>

            {/* Step 3: Kitchen Confirmed */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isKitchenConfirmed 
                ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-200' 
                : 'bg-slate-50/60 border-slate-200 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isKitchenConfirmed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isKitchenConfirmed ? 'text-emerald-700' : 'text-slate-400'}`}>
                  Restaurant Service
                </span>
              </div>
              <h4 className={`text-xs font-bold ${isKitchenConfirmed ? 'text-slate-900' : 'text-slate-400'}`}>
                Kitchen Confirmed
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isKitchenConfirmed ? 'Tokyo Ramen preparing order' : 'Awaiting payment confirmation...'}
              </p>
            </div>

            {/* Step 4: Courier Assignment */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isCourierAssigned 
                ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-200' 
                : isCourierFailed 
                  ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-300' 
                  : 'bg-slate-50/60 border-slate-200 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  isCourierAssigned ? 'bg-emerald-500 text-white' : isCourierFailed ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCourierAssigned ? 'text-emerald-700' : isCourierFailed ? 'text-rose-700' : 'text-slate-400'
                }`}>
                  Courier Service
                </span>
              </div>
              <h4 className={`text-xs font-bold ${isCourierAssigned ? 'text-slate-900' : isCourierFailed ? 'text-rose-900' : 'text-slate-400'}`}>
                {isCourierAssigned ? 'Driver Assigned' : isCourierFailed ? 'Dispatch Failed ❌' : 'Assigning Driver...'}
              </h4>
              <p className={`text-[11px] mt-0.5 ${isCourierFailed ? 'text-rose-700 font-medium' : 'text-slate-500'}`}>
                {isCourierAssigned 
                  ? `${order.courier?.name || 'Driver'}` 
                  : isCourierFailed 
                    ? 'No drivers available in area' 
                    : 'Awaiting food readiness...'}
              </p>
            </div>

          </div>
        </div>

        {/* COMPENSATION FLOW (Triggered if Courier Fails) */}
        {isCourierFailed && (
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-500 text-white rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    2. Azure Service Bus Saga Compensations (Triggered by Courier Failure)
                  </h3>
                  <p className="text-[11px] text-amber-800">
                    Compensating transactions executed in parallel across distributed microservices
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                Compensating
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Compensation 1: Payment Refund */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                isPaymentRefunded
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-200 shadow-sm'
                  : 'bg-white/60 border-amber-200 text-slate-500'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-md ${isPaymentRefunded ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-800'}`}>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase">Payment Service</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">Refund Payment</h5>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isPaymentRefunded ? `Full refund of $${order.totalAmount?.toFixed(2)} processed` : 'Executing refund...'}
                </p>
              </div>

              {/* Compensation 2: Cancel Kitchen Order */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                isRestaurantCancelled
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-200 shadow-sm'
                  : 'bg-white/60 border-amber-200 text-slate-500'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-md ${isRestaurantCancelled ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-800'}`}>
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase">Restaurant Service</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">Cancel Kitchen Order</h5>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isRestaurantCancelled ? 'Kitchen preparation ticket voided' : 'Halting food preparation...'}
                </p>
              </div>

              {/* Compensation 3: Notify Customer */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                isCustomerNotified
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-200 shadow-sm'
                  : 'bg-white/60 border-amber-200 text-slate-500'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-md ${isCustomerNotified ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-800'}`}>
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase">Notification Service</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">Notify Customer</h5>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isCustomerNotified ? 'SMS failure explanation & refund alert sent' : 'Sending SMS alert...'}
                </p>
              </div>

            </div>

            {/* Final State Banner */}
            {isOrderCompensated && (
              <div className="bg-emerald-100/70 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                <div className="flex items-center space-x-2">
                  <CheckCheck className="w-4 h-4 text-emerald-700" />
                  <span>Saga Complete: All compensating transactions synchronized & order finalized as cancelled/refunded.</span>
                </div>
                <span className="text-[11px] bg-emerald-700 text-white px-2 py-0.5 rounded-md">
                  Status: CANCELLED_AND_REFUNDED
                </span>
              </div>
            )}
          </div>
        )}

        {/* SAGA AUDIT TIMELINE */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
            3. Detailed Saga Event Sequence
          </span>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {order.timeline.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
              >
                <div className="flex items-start space-x-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    item.status === 'SUCCESS' || item.status === 'COMPENSATION_SUCCESS' || item.status === 'COMPLETED_COMPENSATION'
                      ? 'bg-emerald-500'
                      : item.status === 'FAILED'
                        ? 'bg-rose-500'
                        : 'bg-brand-500'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{item.stage}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {item.service}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.message}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-2">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
