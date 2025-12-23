import React from 'react';
export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d]">

      <div className="relative">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent 
        rounded-full animate-spin"></div>

        <p className="mt-4 text-gray-300 text-center tracking-wider">
          Loading…
        </p>
      </div>

    </div>
  );
}
