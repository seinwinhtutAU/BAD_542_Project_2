import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import CustomerView from './components/CustomerView';
import RestaurantView from './components/RestaurantView';
import CourierView from './components/CourierView';
import PaymentView from './components/PaymentView';
import NotificationView from './components/NotificationView';
import { ShoppingBag, Utensils, Bike, CreditCard, Bell } from 'lucide-react';

const TABS = [
  { id: 'customer', label: 'Customer', icon: ShoppingBag },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils },
  { id: 'courier', label: 'Courier', icon: Bike },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'notification', label: 'Notification', icon: Bell }
];

function DeliveryAppContent() {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Clean Header with Simple Tabs */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">🍜</span>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Aozora<span className="text-sky-600">Eats</span>
              </span>
            </div>

            {/* Simple Service Tabs */}
            <nav className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5">
        {activeTab === 'customer' && <CustomerView />}
        {activeTab === 'restaurant' && <RestaurantView />}
        {activeTab === 'courier' && <CourierView />}
        {activeTab === 'payment' && <PaymentView />}
        {activeTab === 'notification' && <NotificationView />}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-[11px] text-slate-400">
        Delivery Microservices Demo • Action-Driven Architecture
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <DeliveryAppContent />
    </OrderProvider>
  );
}
