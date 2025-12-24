import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function HistoryDashboard() {

  const [history, setHistory] = useState([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const loadHistory = async () => {
    try {
      const res = await api.get(`/queue/history/`, {
        params: { date, status, search }
      });
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden
      relative
      p-6
      bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d]">

      {/* Glow Backgrounds */}
      <div className="absolute w-96 h-96 bg-blue-500/20 blur-[140px]
        rounded-full top-10 left-10" />

      <div className="absolute w-96 h-96 bg-cyan-400/20 blur-[140px]
        rounded-full bottom-10 right-10" />

      {/* Main Card */}
      <div className="relative max-w-5xl mx-auto
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_25px_60px_rgba(0,0,0,0.4)]
        rounded-3xl p-8 animate-fadeIn mt-16">

        <h2 className="text-3xl font-extrabold text-center
          bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Patient History Log
        </h2>

        {/* Filters */}
        <div className="mt-6 grid md:grid-cols-4 gap-3">
          <input
            type="date"
            className="p-2 rounded bg-white/10 border border-white/20
            text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <select
            className="p-2 rounded bg-white/10 border border-white/20
            text-white focus:ring-2 focus:ring-cyan-400"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option className="text-black" value="">All</option>
            <option className="text-black" value="completed">Completed</option>
            <option className="text-black" value="cancelled">Cancelled</option>
          </select>

          <input
            placeholder="Search by name"
            className="p-2 rounded bg-white/10 border border-white/20
            text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <button
            onClick={loadHistory}
            className="px-4 py-2 rounded-xl font-semibold
            bg-gradient-to-r from-blue-500 to-cyan-400 text-white
            shadow-lg shadow-blue-900/40
            hover:scale-[1.04] hover:shadow-xl
            transition-all duration-300"
          >
            Apply Filters
          </button>
        </div>

        {/* SCROLLABLE TABLE FIX */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full">
            <thead className="bg-white/10 text-gray-200">
              <tr>
                <th className="p-3 text-left">Token</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Completed Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map(p => (
                <tr
                  key={p._id}
                  className="border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="p-3 font-bold text-cyan-300">
                    {p.tokenNumber}
                  </td>

                  <td className="p-3 text-gray-200">{p.name}</td>

                  <td className="p-3">
                    <span className={`
                      px-3 py-1 rounded-full text-sm
                      ${p.status === "completed"
                        ? "bg-green-500/30 text-green-300 border border-green-400/30"
                        : "bg-red-500/30 text-red-300 border border-red-400/30"
                      }
                    `}>
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-300">
                    {p.completedAt
                      ? new Date(p.completedAt).toLocaleString()
                      : "--"}
                  </td>
                </tr>
              ))}

              {!history.length && (
                <tr>
                  <td colSpan="4"
                    className="text-center p-6 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
