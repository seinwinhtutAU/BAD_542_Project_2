import React, { useState } from 'react';
import { ShoppingBag, AlertOctagon, Sparkles, Send, MapPin, User, Phone, Check } from 'lucide-react';

const MENU_ITEMS = [
  { id: '1', name: 'Tonkotsu Ramen', price: 15.50, desc: 'Rich pork broth with chashu' },
  { id: '2', name: 'Crispy Gyoza (6pcs)', price: 7.50, desc: 'Pan-fried dumplings' },
  { id: '3', name: 'Matcha Iced Latte', price: 4.50, desc: 'Organic Japanese green tea' },
];

export default function OrderForm({ onSubmitOrder, isSubmitting }) {
  const [customerName, setCustomerName] = useState('Alex Taylor');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 438-9021');
  const [deliveryAddress, setDeliveryAddress] = useState('456 Market St, Suite 200');
  const [selectedItems, setSelectedItems] = useState({ '1': 1, '2': 1, '3': 1 });
  const [simulateCourierFailure, setSimulateCourierFailure] = useState(true);

  const toggleItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: prev[id] ? 0 : 1
    }));
  };

  const calculateTotal = () => {
    return MENU_ITEMS.reduce((sum, item) => {
      const qty = selectedItems[item.id] || 0;
      return sum + (item.price * qty);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = MENU_ITEMS
      .filter(item => selectedItems[item.id] > 0)
      .map(item => ({
        name: item.name,
        qty: selectedItems[item.id],
        price: item.price
      }));

    if (items.length === 0) {
      alert('Please select at least one item.');
      return;
    }

    const total = calculateTotal();

    onSubmitOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      totalAmount: total,
      simulateCourierFailure
    });
  };

  const total = calculateTotal();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      
      {/* Card Header */}
      <div className="bg-gradient-to-r from-brand-600 to-blue-700 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Create Delivery Order</h2>
              <p className="text-xs text-blue-100">Dispatches via Azure Service Bus Topics</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 rounded-full">
            Saga Step 1
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        
        {/* Customer Details */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Info</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50"
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Delivery Address"
              required
              className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Food Items</label>
            <span className="text-xs text-slate-400">Tokyo Ramen Express</span>
          </div>
          <div className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isSelected = (selectedItems[item.id] || 0) > 0;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/60 border-brand-300 text-brand-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">${item.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier Failure Simulation Toggle (Requirement Highlight) */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          simulateCourierFailure
            ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-2.5">
              <div className={`p-1.5 rounded-lg mt-0.5 ${
                simulateCourierFailure ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Simulate Courier Service Failure
                </span>
                <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                  Triggers Courier failure scenario: Azure Service Bus automatically initiates <strong>compensating events</strong> to <strong>refund payment</strong>, <strong>cancel restaurant order</strong>, and <strong>notify customer</strong>.
                </p>
              </div>
            </div>
            
            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setSimulateCourierFailure(!simulateCourierFailure)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                simulateCourierFailure ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  simulateCourierFailure ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Total Amount</span>
            <span className="text-lg font-bold text-slate-900">${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || total === 0}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs text-white flex items-center space-x-2 shadow-md transition-all active:scale-[0.98] ${
              simulateCourierFailure
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-500/20'
                : 'bg-gradient-to-r from-brand-600 to-blue-700 hover:from-brand-700 hover:to-blue-800 shadow-brand-500/20'
            } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span>Publishing to Bus...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{simulateCourierFailure ? 'Place Order & Trigger Failure Saga' : 'Place Order (Happy Path)'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
