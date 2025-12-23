import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d] flex justify-center items-center p-6">

      <div className="absolute w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-400/20 blur-[140px] rounded-full bottom-10 right-10"></div>

      <div className="relative max-w-4xl w-full 
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        shadow-[0_25px_60px_rgba(0,0,0,0.4)]
        rounded-3xl p-10 animate-fadeIn">

        <h1 className="text-4xl md:text-5xl font-extrabold 
        text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Smart Hospital Queue
          <span className="block mt-1 text-lg font-normal text-gray-300">Management System</span>
        </h1>

        <p className="mt-5 text-gray-300 text-center leading-relaxed">
          Reduce crowding, improve patient trust, real‑time updates,
          doctor control & transparent queue experience — all in one system.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md 
          p-5 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
            <h3 className="font-bold text-cyan-300">Real‑time Queue</h3>
            <p className="text-sm text-gray-200">
              Live tracking, ETA & Top‑3 alerts
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 backdrop-blur-md 
          p-5 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
            <h3 className="font-bold text-green-300">Doctor Control</h3>
            <p className="text-sm text-gray-200">
              Availability + Break + Pause system
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 backdrop-blur-md 
          p-5 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
            <h3 className="font-bold text-purple-300">Secure History</h3>
            <p className="text-sm text-gray-200">
              Records + filters + logs
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

          <Link
            to="/signup"
            className="px-8 py-3 rounded-xl text-center font-semibold
            bg-gradient-to-r from-blue-500 to-cyan-400 
            text-white shadow-lg shadow-blue-900/40
            hover:scale-[1.04] hover:shadow-xl 
            transition-all duration-300">
            🚀 Get Started
          </Link>

          <Link
            to="/login"
            className="px-8 py-3 rounded-xl text-center font-semibold
            border border-white/30 text-white
            hover:bg-white/10 hover:scale-[1.03]
            transition-all duration-300">
            Already have an account? Login
          </Link>
        </div>

        <p className="mt-6 text-center text-gray-300 text-sm">
          Built for hospitals to be efficient, transparent & stress‑free.
        </p>
      </div>
    </div>
  );
}
