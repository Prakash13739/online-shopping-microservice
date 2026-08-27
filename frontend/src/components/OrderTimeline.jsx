import React from 'react';
import { CheckCircle2, Circle, Clock, Package, Truck, CheckCheck, XCircle } from 'lucide-react';

export default function OrderTimeline({ status, createdAt }) {
  const norm = (status || '').toUpperCase();

  if (norm === 'FAILED' || norm === 'CANCELLED') {
    return (
      <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h4 className="text-base font-bold text-rose-900">Order {norm}</h4>
        <p className="text-xs text-rose-600 mt-1">
          {norm === 'FAILED'
            ? 'The payment simulation was unsuccessful. Any reserved inventory was automatically released back to stock.'
            : 'This order was cancelled.'}
        </p>
      </div>
    );
  }

  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: Package, desc: 'Payment verified and order accepted' },
    { key: 'PROCESSING', label: 'Processing', icon: Clock, desc: 'Packed at distribution hub' },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck, desc: 'In transit with express logistics' },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCheck, desc: 'Delivered to your address' },
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'PAYMENT_PENDING':
      case 'PENDING': return 0;
      case 'PAID':
      case 'CONFIRMED': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(norm);

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
        Live Order Fulfillment Timeline
      </h4>

      <div className="relative">
        {/* Progress connecting line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0 hidden md:block">
          <div
            className="h-full bg-brand-600 transition-all duration-700"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                
                {/* Circle Icon */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-brand-600 text-white shadow-brand-500/30 ring-4 ring-brand-100 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                {/* Text Description */}
                <div>
                  <h5
                    className={`text-sm font-bold ${
                      isCurrent
                        ? 'text-brand-600'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
