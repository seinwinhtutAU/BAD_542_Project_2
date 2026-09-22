import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, ArrowRight, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const SIMPLE_MENU = [
  { id: '1', name: 'Tonkotsu Ramen', price: 15.00, icon: '🍜' },
  { id: '2', name: 'Pork Gyoza (6pcs)', price: 7.50, icon: '🥟' },
  { id: '3', name: 'Chashu Rice Bowl', price: 12.00, icon: '🍚' },
  { id: '4', name: 'Iced Green Tea', price: 4.00, icon: '🍵' }
];

export default function CustomerView() {
  const { cart, addToCart, updateQuantity, subtotal, deliveryFee, tax, grandTotal, placeOrder, isSubmitting, activeOrder } = useOrder();
  const [customerName, setCustomerName] = useState('Alex Taylor');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 438-9021');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace');

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    placeOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      paymentMethod: 'Credit Card (•••• 4242)'
    });
  };

  const isOrderFailed = activeOrder?.status === 'CANCELLED_AND_REFUNDED';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-5xl mx-auto">
      
      {/* Left: Menu & Checkout (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Simple Menu Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Select Items</h2>
            <span className="text-xs text-slate-400">Kyoto Ramen Store</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SIMPLE_MENU.map((item) => {
              const inCart = cart.find(i => i.id === item.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs font-semibold text-sky-700">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1 text-slate-800">{qty}</span>
                      </>
                    )}
                    <button
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                      className="p-1 text-sky-600 hover:text-sky-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Customer Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-slate-500 mb-1 block">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-slate-500 mb-1 block">Phone (SMS Alert)</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-500 mb-1 block">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="text-base font-bold text-slate-900">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || isSubmitting}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Place Order'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Right: Accurate Live Order Status (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Order Status</h3>
            {activeOrder ? (
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {activeOrder.orderId}
              </span>
            ) : (
              <span className="text-xs text-slate-400">No active order</span>
            )}
          </div>

          {!activeOrder ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <ShoppingBag className="w-7 h-7 mx-auto text-slate-300" />
              <p>Place an order to see live service status.</p>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Order Steps reflecting manual service actions */}
              <div className="space-y-2">
                {activeOrder.steps?.map((step) => {
                  const isSuccess = step.status === 'SUCCESS';
                  const isFailed = step.status === 'FAILED';
                  const isWaiting = step.status === 'AWAITING_ACTION';

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 transition-all ${
                        isSuccess
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : isFailed
                            ? 'bg-rose-50 border-rose-200'
                            : isWaiting
                              ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                              : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className="mt-0.5">
                          {isSuccess ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isFailed ? (
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                          ) : isWaiting ? (
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="font-bold text-slate-900">{step.title}</h4>
                            {isWaiting && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 rounded">
                                Waiting Action
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{step.timestamp}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Compensation Box on Courier Failure */}
              {isOrderFailed && activeOrder.compensations && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold">
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                    <span>Courier Failed — Compensation Completed</span>
                  </div>
                  
                  <div className="space-y-1 text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-amber-100">
                    <div className="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>✓ 100% Refund Issued:</span>
                      <span>${activeOrder.compensations.refund?.amount?.toFixed(2)} (Ref: {activeOrder.compensations.refund?.refundId})</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>✓ Restaurant Order:</span>
                      <span>Cancelled</span>
                    </div>
                    <div className="flex items-center justify-between text-purple-700">
                      <span>✓ Customer Notification:</span>
                      <span>Sent</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
