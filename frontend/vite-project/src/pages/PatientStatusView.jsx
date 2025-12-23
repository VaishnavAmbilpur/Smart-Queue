import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { socket } from "../services/socket";

export default function PatientStatusView() {
  const { uniqueLinkId } = useParams();

  const [data, setData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(null);
  const [doctorStatus, setDoctorStatus] = useState("Available");

  function formatTime(mins) {
    if (mins == null) return "--";
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
    }
    return `${mins} min`;
  }

  async function loadStatus() {
    try {
      const res = await api.get(`/queue/status/${uniqueLinkId}`);

      if (res.data.status === "completed") return setCompleted(true);
      if (res.data.status === "cancelled") return setCancelled(true);

      setData(res.data);

      const me = res.data?.queue?.find(p => p.isMe);

      if (me?.waitMinutes != null) setRemainingMinutes(me.waitMinutes);
      else if (res.data?.myPosition != null) {
        const peopleBefore = res.data.myPosition - 1;
        const avg = res.data.avgTime || 5;
        setRemainingMinutes(peopleBefore * avg);
      }

      socket.emit("joinDoctorRoom", res.data.doctorId);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadStatus();

    socket.emit("joinPatientRoom", uniqueLinkId);

    socket.on("visitCompleted", () => setCompleted(true));
    socket.on("visitCancelled", () => setCancelled(true));
    socket.on("queueUpdated", loadStatus);

    socket.on("doctorAvailabilityChanged", status => {
      setDoctorStatus(status);
      if (status === "Available") loadStatus();
    });

    return () => {
      socket.off("visitCompleted");
      socket.off("visitCancelled");
      socket.off("queueUpdated");
      socket.off("doctorAvailabilityChanged");
    };
  }, []);

  useEffect(() => {
    if (remainingMinutes == null) return;
    if (doctorStatus !== "Available") return;

    const interval = setInterval(() => {
      setRemainingMinutes(prev => (prev > 0 ? prev - 1 : 0));
    }, 60000);

    return () => clearInterval(interval);
  }, [remainingMinutes, doctorStatus]);

  if (cancelled)
    return (
      <div className="min-h-screen flex justify-center items-center bg-red-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-700">Appointment Cancelled ❌</h2>
          <p className="mt-2 text-gray-600">Please contact reception if needed.</p>
        </div>
      </div>
    );

  if (completed)
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-700">Visit Completed 🎉</h2>
          <p className="mt-2 text-gray-600">Thank you for visiting</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d]">
        <p className="text-lg text-gray-300 animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center
      bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d] p-6">

      <div className="absolute w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-400/20 blur-[140px] rounded-full bottom-10 right-10"></div>

      <div className="relative w-[420px]
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_25px_60px_rgba(0,0,0,0.4)]
        rounded-3xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-extrabold text-center
          bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Patient Status
        </h2>

        <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-gray-200"><b>Token:</b> {data.myTokenNumber}</p>
          <p className="text-gray-200"><b>Position:</b> {data.myPosition}</p>
        </div>

        {doctorStatus !== "Available" && (
          <p className="mt-3 bg-red-400/20 text-red-300 border border-red-400/30
            p-2 rounded text-center font-semibold">
            Doctor is {doctorStatus}. Queue Paused ⏸️
          </p>
        )}

        <div className="mt-3 bg-blue-400/20 border border-blue-300/30
          text-blue-300 p-2 rounded text-center font-semibold">
          Estimated Wait ⏳ : {formatTime(remainingMinutes)}
        </div>

        {data.myPosition <= 3 && (
          <p className="mt-3 bg-yellow-300/20 text-yellow-300 border border-yellow-300/30
            p-2 rounded text-sm text-center animate-pulse">
            Be Ready — Doctor may call you anytime ⚠️
          </p>
        )}

        <h3 className="mt-5 text-gray-200 font-semibold">Current Queue</h3>

        <div className="mt-2 border border-white/20 rounded-xl overflow-hidden">
          {data.queue.map(p => (
            <div
              key={p.id}
              className={`px-3 py-2 border-b border-white/10 text-sm flex justify-between
                ${p.isMe ? "bg-blue-400/10 text-cyan-300 font-semibold" : "text-gray-200"}`}>
              <span>#{p.tokenNumber} — {p.isMe ? p.name : "Someone"}</span>
              <span>{p.position}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
