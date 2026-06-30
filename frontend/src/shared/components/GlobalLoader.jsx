import React from 'react';

export default function GlobalLoader() {
  return (
    <div className="min-h-screen bg-[#07080C] flex flex-col items-center justify-center text-white">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-[#1E293B] border-t-blue-500 rounded-full animate-spin relative z-10"></div>
      </div>
      <p className="mt-4 text-sm font-bold text-gray-400 tracking-widest uppercase animate-pulse">Loading...</p>
    </div>
  );
}
