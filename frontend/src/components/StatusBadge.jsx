import React from 'react';
import { CheckCircle2, Clock, Truck, Package, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const norm = (status || '').toUpperCase();

  switch (norm) {
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>
      );
    case 'SHIPPED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Truck className="w-3.5 h-3.5" /> Shipped
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5" /> Processing
        </span>
      );
    case 'CONFIRMED':
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          <Package className="w-3.5 h-3.5" /> Confirmed
        </span>
      );
    case 'PAYMENT_PENDING':
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200">
          <Clock className="w-3.5 h-3.5" /> Payment Pending
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" /> Failed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-300">
          <XCircle className="w-3.5 h-3.5" /> Cancelled
        </span>
      );
    case 'IN_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
          In Stock
        </span>
      );
    case 'LOW_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
          <AlertCircle className="w-3 h-3" /> Low Stock
        </span>
      );
    case 'OUT_OF_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-700">
          Out of Stock
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
          {status}
        </span>
      );
  }
}
