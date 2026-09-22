import React from 'react';
import { Radio, CheckCircle2, AlertTriangle, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export default function Header({ busMode, stats, isConnected, onRefresh }) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Delivery Saga App
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  Azure Service Bus
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Event-Driven Architecture & Saga Compensation System
              </p>
            </div>
          </div>

          {/* Service Bus Status & Global Stats */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Bus Mode Badge */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-500 font-medium">Bus Engine:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-brand-600" />
                {busMode || 'Azure Service Bus'}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed: <strong>{stats?.completed || 0}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Compensated: <strong>{stats?.failedAndCompensated || 0}</strong></span>
              </div>
            </div>

            <button
              onClick={onRefresh}
              title="Refresh Data"
              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-slate-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
