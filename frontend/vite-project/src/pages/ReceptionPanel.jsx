import React, { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../services/socket";
import Loader from "../components/Loader";

export default function ReceptionPanel() {
  const doctorId = localStorage.getItem("doctorId");
  if (!doctorId) return <Loader />;

  const [patientName, setPatientName] = useState("");
  const [patientNumber, setPatientNumber] = useState("");
  const [description, setDescription] = useState("");
  const [queue, setQueue] = useState([]);
  const [msg, setMsg] = useState("");
  const [queueLoading, setQueueLoading] = useState(true);



  useEffect(() => {
    if (!doctorId) return;

    socket.emit("joinDoctorRoom", doctorId);
    loadQueue();

    socket.on("queueUpdated", loadQueue);

    socket.on("doctorAvailabilityChanged", status => {
      if (status === "Not Available") {
        setMsg("⚠️ Doctor is currently Not Available. Queue Paused");
      } else {
        setMsg("✅ Doctor Available. Queue Resumed");
        loadQueue();
      }
    });

    return () => {
      socket.off("queueUpdated");
      socket.off("doctorAvailabilityChanged");
    };
  }, []);

  async function loadQueue() {
    try {
      setQueueLoading(true);
      const res = await api.get(`/queue/${doctorId}`);
      setQueue(res.data);
    } catch (err) {
      console.log(err);
    }finally{
      setQueueLoading(false);
    }
  }

  async function addPatient(e) {
    e.preventDefault();
    await api.post("/queue/add", {
      name: patientName,
      description,
      number: patientNumber
    });

    setMsg("Patient Added 🎉");
    setPatientName("");
    setPatientNumber("");
    setDescription("");
    setTimeout(() => setMsg(""), 1200);
  }

  async function completePatient(id) {
    await api.put(`/queue/complete/${id}`);
  }

  async function cancelPatient(id) {
    await api.put(`/queue/cancel/${id}`);
  }

  async function moveUp(index) {
  const topLimit = Math.min(3, queue.length);
  if (index === 0 || index >= topLimit) return;

  const updated = [...queue];
  [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];

  setQueue(updated); 

  await api.put(`/queue/reorder/${doctorId}`, {
    newOrder: updated.map(p => p._id)
  });
}

async function moveDown(index) {
  const topLimit = Math.min(3, queue.length);
  if (index >= topLimit - 1) return;

  const updated = [...queue];
  [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];

  setQueue(updated); 

  await api.put(`/queue/reorder/${doctorId}`, {
    newOrder: updated.map(p => p._id)
  });
}



  return (
    <div className="min-h-screen
      bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d]
      p-6 pt-28">

      <div className="max-w-6xl mx-auto
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_25px_60px_rgba(0,0,0,0.4)]
        rounded-3xl p-6 animate-fadeIn">

        <h1 className="text-3xl font-extrabold text-center
          bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Reception Panel
        </h1>

        {msg && (
          <p className="text-center mt-3
            bg-blue-100/20 border border-white/20
            text-cyan-300 py-2 rounded-lg animate-fadeIn">
            {msg}
          </p>
        )}

        <form onSubmit={addPatient} className="mt-6 flex gap-3 flex-wrap">
          <input
            className="p-2 bg-white/10 border border-white/30 text-white rounded flex-1"
            placeholder="Patient Name"
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            required
          />

          <input
            className="p-2 bg-white/10 border border-white/30 text-white rounded flex-1"
            placeholder="Patient Number"
            value={patientNumber}
            onChange={e => setPatientNumber(e.target.value)}
            required
          />

          <input
            className="p-2 bg-white/10 border border-white/30 text-white rounded flex-1"
            placeholder="Description / Problem"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button className="px-6 py-2 rounded-lg
            bg-gradient-to-r from-blue-500 to-cyan-400
            text-white shadow-md hover:scale-[1.03]
            transition">
            Add Patient
          </button>
        </form>

        <h2 className="mt-8 text-xl text-gray-200 font-semibold">Current Queue</h2>

        <div className="mt-3 overflow-x-auto border border-white/20 rounded-xl">
          <table className="w-full text-gray-200 text-left">
            <thead className="bg-white/10 border-b border-white/20">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Wait</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {queueLoading && (
                <tr>
                  <td colSpan="6" className="p-6">
                    <Loader />
                  </td>
                </tr>
              )}






              {queue.map((p, idx) => {
                const link = `${window.location.origin}/status/${p.uniqueLinkId}`;

                return (
                  <tr key={p._id}
                    className={`border-b border-white/10
                    ${idx < 3 ? "bg-yellow-200/10" : ""}`}>

                    <td className="px-4 py-3 font-bold">{p.tokenNumber}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 text-sm">{p.description || "--"}</td>
                    <td className="px-4 py-3">{p.waitMinutes ?? "--"} min</td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link);
                          setMsg("Patient Link Copied ✔️");
                          setTimeout(() => setMsg(""), 1500);
                        }}
                        className="
                          px-4 py-1 rounded-full
                          bg-white/10 border border-white/20
                          text-cyan-300
                          shadow hover:shadow-lg
                          hover:bg-white/20
                          transition-all duration-300
                        "
                      >
                        Copy Link
                      </button>
                    </td>

                    <td className="px-4 py-3 flex gap-2 justify-center">
                      {idx < Math.min(3, queue.length)&& (
                        <>
                          <button
                            className="px-3 bg-blue-500 hover:bg-blue-600 rounded shadow"
                            onClick={() => moveUp(idx)}
                          >
                            ⬆️
                          </button>

                          <button
                            className="px-3 bg-blue-500 hover:bg-blue-600 rounded shadow"
                            onClick={() => moveDown(idx)}
                          >
                            ⬇️
                          </button>
                        </>
                      )}

                      <button
                        className="px-3 bg-green-500 hover:bg-green-600 rounded shadow"
                        onClick={() => completePatient(p._id)}
                      >
                        Complete
                      </button>

                      <button
                        className="px-3 bg-red-600 hover:bg-red-700 rounded shadow"
                        onClick={() => cancelPatient(p._id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!queue.length && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-400">
                    No patients yet
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
