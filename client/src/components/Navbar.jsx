import React from 'react';
import { ShoppingBag, Bell, Clock, MapPin, ChevronDown } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function Navbar({ onOpenHistory }) {
  const { cart, setIsCartOpen, activeOrder, setIsTrackingModalOpen, notifications, setIsNotificationsOpen } = useOrder();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <span className="text-xl">🍜</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Aozora<span className="text-sky-600">Eats</span>
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                Japanese Handcrafted Dining & Delivery
              </p>
            </div>
          </div>

          {/* Location Delivery Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-sky-50/50 hover:border-sky-200 transition-colors cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium text-slate-700">Deliver to:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[160px]">742 Evergreen Terrace</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Active Order Button */}
            {activeOrder && (
              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeOrder.status === 'CANCELLED_AND_REFUNDED'
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                    : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/25'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>
            )}

            {/* Order History */}
            <button
              onClick={onOpenHistory}
              title="My Orders"
              className="p-2.5 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors border border-slate-200"
            >
              <Clock className="w-5 h-5" />
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              title="Notifications"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors border border-slate-200"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/25 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-sky-700 text-xs font-extrabold">
                  {totalItems}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
