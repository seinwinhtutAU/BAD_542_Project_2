import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, MapPin, CreditCard } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    placeOrder,
    isSubmitting
  } = useOrder();

  const [customerName, setCustomerName] = useState('Alex Taylor');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 438-9021');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Apt 4B');
  const [deliveryNotes, setDeliveryNotes] = useState('Leave at front door');
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay (Visa •••• 4242)');

  if (!isCartOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    placeOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryNotes,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Your Cart</h2>
                <p className="text-xs text-slate-500">Kyoto Ramen & Izakaya</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            
            {/* Items List */}
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-600">Your cart is empty</p>
                <p className="text-xs text-slate-400">Click "+" on any menu items to add!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order Items ({cart.length})
                </span>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs shrink-0">
                        {item.icon || '🍜'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">{item.name}</h4>
                        <p className="text-xs font-bold text-sky-700">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 px-1 py-0.5 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-slate-500 hover:text-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-slate-500 hover:text-slate-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                {/* Delivery & Contact Details */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Delivery Address & Contact
                  </span>
                  
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 mb-1 block">Phone (For SMS delivery alerts)</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 mb-1 block">Delivery Address</label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 mb-1 block">Delivery Instructions</label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Method
                  </span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-sky-600" />
                      <span className="font-semibold text-slate-800">{paymentMethod}</span>
                    </div>
                    <span className="text-[11px] text-sky-600 font-bold cursor-pointer">Change</span>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Items Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Tax (8.5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-sky-700 font-black">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Placing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
