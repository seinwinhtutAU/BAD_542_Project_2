import React, { useState } from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const { addToCart, cart } = useOrder();
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const filteredItems = selectedCategory === 'All Items'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedAnimationId(item.id);
    setTimeout(() => setAddedAnimationId(null), 800);
  };

  const getItemQuantity = (id) => {
    const found = cart.find(i => i.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <section className="space-y-6">
      
      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid with Clean Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const qty = getItemQuantity(item.id);
          const isJustAdded = addedAnimationId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header row: Icon, Category & Rating */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl shadow-xs">
                    {item.icon}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {item.popular && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-200">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-500 mr-1" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>

              {/* Price & Add (+) Button */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price</span>
                  <span className="text-base font-extrabold text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(item)}
                  title="Add to order"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : qty > 0
                        ? 'bg-sky-50 text-sky-700 border border-sky-300 hover:bg-sky-100'
                        : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : qty > 0 ? (
                    <>
                      <span>{qty} in cart</span>
                      <Plus className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
