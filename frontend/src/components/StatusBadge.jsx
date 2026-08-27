import React from 'react';
import { CheckCircle2, Clock, Truck, Package, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const norm = (status || '').toUpperCase();

  switch (norm) {
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7' }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>
      );
    case 'SHIPPED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(6, 182, 212, 0.18)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#67e8f9' }}>
          <Truck className="w-3.5 h-3.5" /> Shipped
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fcd34d' }}>
          <Clock className="w-3.5 h-3.5" /> Processing
        </span>
      );
    case 'CONFIRMED':
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(139, 92, 246, 0.18)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd' }}>
          <Package className="w-3.5 h-3.5" /> Confirmed
        </span>
      );
    case 'PAYMENT_PENDING':
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(249, 115, 22, 0.18)', border: '1px solid rgba(249, 115, 22, 0.4)', color: '#fdba74' }}>
          <Clock className="w-3.5 h-3.5" /> Pending
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}>
          <XCircle className="w-3.5 h-3.5" /> Failed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full"
          style={{ background: 'rgba(148, 163, 184, 0.15)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#cbd5e1' }}>
          <XCircle className="w-3.5 h-3.5" /> Cancelled
        </span>
      );
    case 'IN_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black rounded-full"
          style={{ background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7' }}>
          In Stock
        </span>
      );
    case 'LOW_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black rounded-full"
          style={{ background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fcd34d' }}>
          <AlertCircle className="w-3 h-3" /> Low Stock
        </span>
      );
    case 'OUT_OF_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black rounded-full"
          style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}>
          Out of Stock
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full glass text-slate-300">
          {status}
        </span>
      );
  }
}
