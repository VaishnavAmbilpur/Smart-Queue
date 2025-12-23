import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Signup() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      setMsg("Signup Successful 🎉 Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen 
    bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#001d3d]
    flex justify-center items-center p-6">

      <div className="absolute w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-400/20 blur-[140px] rounded-full bottom-10 right-10"></div>

      <div className="relative w-[380px]
      bg-white/10 backdrop-blur-xl
      border border-white/20
      shadow-[0_25px_60px_rgba(0,0,0,0.4)]
      rounded-3xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-extrabold text-center 
        bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Doctor Signup
        </h2>

        {msg && (
          <p className="mt-3 text-sm text-cyan-300 bg-white/10 border border-white/20 p-2 rounded text-center">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">

          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-2 rounded-xl
            bg-white/10 text-white
            border border-white/20
            placeholder-gray-300
            focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

          <input
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
            className="w-full p-2 rounded-xl
            bg-white/10 text-white
            border border-white/20
            placeholder-gray-300
            focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 rounded-xl
            bg-white/10 text-white
            border border-white/20
            placeholder-gray-300
            focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 rounded-xl
            bg-white/10 text-white
            border border-white/20
            placeholder-gray-300
            focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

          <button
            className="w-full py-2 rounded-xl font-semibold
            bg-gradient-to-r from-blue-500 to-cyan-400
            text-white shadow-lg shadow-blue-900/40
            hover:scale-[1.03] hover:shadow-xl
            transition-all duration-300">
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-300">
          Already have an account?{" "}
          <Link className="text-cyan-300 underline" to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
