import React, { useState } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronRight, Filter } from 'lucide-react';

export default function EventLogStream({ logs, onClearLogs }) {
  const [filterType, setFilterType] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === 'ALL') return true;
    if (filterType === 'COMPENSATION') {
      return log.eventType.includes('Failed') || log.eventType.includes('Refund') || log.eventType.includes('Cancelled') || log.eventType.includes('Notified');
    }
    if (filterType === 'FORWARD') {
      return log.eventType === 'OrderCreated' || log.eventType === 'PaymentProcessed' || log.eventType === 'RestaurantOrderConfirmed' || log.eventType === 'CourierAssigned';
    }
    return true;
  });

  const getEventBadgeClass = (eventType) => {
    if (eventType.includes('Failed') || eventType.includes('Reject')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (eventType.includes('Refund') || eventType.includes('Cancelled')) {
      return 'bg-amber-100 text-amber-900 border-amber-200';
    }
    if (eventType.includes('Notified')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Azure Service Bus Live Event Stream</h3>
            <p className="text-[11px] text-slate-500">Real-time Topic Messages & Compensations</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter */}
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'ALL' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('COMPENSATION')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'COMPENSATION' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compensations
            </button>
            <button
              onClick={() => setFilterType('FORWARD')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'FORWARD' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Forward
            </button>
          </div>

          <button
            onClick={onClearLogs}
            title="Clear logs"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-slate-900 font-mono text-[11px]">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No events published yet. Create an order to see live Azure Service Bus messages.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="bg-slate-800/90 rounded-lg border border-slate-700/60 p-2.5 hover:border-slate-600 transition-all text-slate-300"
              >
                <div 
                  onClick={() => toggleExpand(log.id)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getEventBadgeClass(log.eventType)}`}>
                      {log.eventType}
                    </span>
                    <span className="text-brand-400 font-semibold">{log.sourceService}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[10px]">Order: <span className="text-slate-200">{log.orderId}</span></span>
                    <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-700 text-[11px] text-slate-300">
                    <div className="text-slate-400 text-[10px] mb-1">
                      Event ID: <span className="text-slate-200">{log.id}</span> • Topic: <span className="text-emerald-400">delivery-saga-topic</span>
                    </div>
                    <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 text-[10px] overflow-x-auto custom-scrollbar">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
