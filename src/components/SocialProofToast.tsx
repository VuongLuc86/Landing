import React, { useState, useEffect } from 'react';
import { RECENT_ORDERS_TOAST } from '../data/mockData';

export const SocialProofToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ORDERS_TOAST.length);
        setIsVisible(true);
      }, 600);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const currentItem = RECENT_ORDERS_TOAST[currentIndex];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-200/90 flex items-center gap-3 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
      </div>
      <div className="flex flex-col text-xs leading-tight">
        <span className="font-bold text-slate-900">
          {currentItem.name} <span className="font-normal text-slate-500">({currentItem.location})</span>
        </span>
        <span className="text-emerald-700 font-semibold mt-0.5">
          Vừa đặt: {currentItem.packageName}
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 led-indicator" />
          {currentItem.timeAgo}
        </span>
      </div>
    </div>
  );
};
