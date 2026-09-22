import React from 'react';
import { ShoppingCart, CreditCard, Utensils, Truck, Bell, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

export default function ServiceStatusCards({ serviceStatus }) {
  const paymentRefunds = serviceStatus?.paymentService?.refunds || [];
  const payments = serviceStatus?.paymentService?.payments || [];
  const kitchenOrders = serviceStatus?.restaurantService?.kitchenOrders || [];
  const dispatches = serviceStatus?.courierService?.dispatches || [];
  const notifications = serviceStatus?.notificationService?.notifications || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Connected Microservices (Azure Service Bus Listeners)
        </h3>
        <span className="text-xs text-brand-600 font-semibold">5 Active Services</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* 1. Order Service */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Order Service</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Orders:</span>
              <span className="font-semibold text-slate-800">{serviceStatus?.stats?.total || 0}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Completed:</span>
              <span className="font-semibold text-emerald-600">{serviceStatus?.stats?.completed || 0}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Compensated:</span>
              <span className="font-semibold text-rose-600">{serviceStatus?.stats?.failedAndCompensated || 0}</span>
            </div>
          </div>
        </div>

        {/* 2. Payment Service */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Payment Service</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Captured:</span>
              <span className="font-semibold text-slate-800">{payments.length}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Refunds Issued:</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                {paymentRefunds.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Auto-refunds on failure
            </div>
          </div>
        </div>

        {/* 3. Restaurant Service */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Restaurant Svc</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Utensils className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Kitchen Tickets:</span>
              <span className="font-semibold text-slate-800">{kitchenOrders.length}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Cancelled:</span>
              <span className="font-semibold text-rose-600">
                {kitchenOrders.filter(k => k.status === 'CANCELLED').length}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Tokyo Ramen Express
            </div>
          </div>
        </div>

        {/* 4. Courier Service */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Courier Service</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Assigned:</span>
              <span className="font-semibold text-emerald-600">
                {dispatches.filter(d => d.status === 'ASSIGNED').length}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Failed Dispatches:</span>
              <span className="font-semibold text-rose-600">
                {dispatches.filter(d => d.status === 'FAILED').length}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Drivers pool: 3
            </div>
          </div>
        </div>

        {/* 5. Notification Service */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Notification Svc</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Sent Alerts:</span>
              <span className="font-semibold text-slate-800">{notifications.length}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Channels:</span>
              <span className="font-semibold text-purple-700">SMS / Push</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Alerts customer on cancel
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
