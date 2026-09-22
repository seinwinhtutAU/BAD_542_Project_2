import React from 'react';
import { Star, Clock, Bike, MapPin, Heart, Utensils } from 'lucide-react';
import { RESTAURANT_DATA } from '../data/mockData';

export default function RestaurantHero() {
  return (
    <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
      
      {/* Light Blue Styled Restaurant Header */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              {RESTAURANT_DATA.icon}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-100 px-2.5 py-0.5 rounded-full bg-white/15 inline-block">
                Japanese Cuisine
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {RESTAURANT_DATA.name}
              </h1>
              <p className="text-xs sm:text-sm text-sky-100">
                {RESTAURANT_DATA.tagline}
              </p>
            </div>
          </div>

          <button className="self-start sm:self-center p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all">
            <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
          </button>

        </div>
      </div>

      {/* Info Badges Bar */}
      <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-slate-600">
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500 mr-1" />
              <span>{RESTAURANT_DATA.rating}</span>
            </div>
            <span className="text-slate-400">({RESTAURANT_DATA.reviewsCount})</span>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-800">{RESTAURANT_DATA.deliveryTime}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center space-x-1.5">
            <Bike className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-800">{RESTAURANT_DATA.deliveryFee} Delivery</span>
          </div>

          {/* Address */}
          <div className="hidden md:flex items-center space-x-1.5 text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{RESTAURANT_DATA.address}</span>
          </div>

        </div>

        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Open Now • 11:00 AM – 10:00 PM
        </div>
      </div>

    </div>
  );
}
