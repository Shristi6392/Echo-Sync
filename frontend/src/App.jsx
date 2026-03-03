import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Landing, { V0Landing } from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RoleRoute from "./components/RoleRoute";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const Motion = motion;

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 relative">
        <div className="w-full max-w-3xl pb-10 text-center tracking-wide">
          <h1 className="font-sora text-[46px] font-extrabold uppercase tracking-[0.32em] text-[#0F3D2E]">
            <span className="text-[#1DB954]">Eco</span>
            <span className="text-[#1A1A1A]">-Sync</span>
          </h1>
          <p className="mt-3 font-manrope text-[20px] font-medium text-[#4A4A4A]">
            Where Waste Becomes Worth.
          </p>
          <p className="mt-3 font-montserrat text-[32px] font-extrabold tracking-[0.094rem] text-[#111111]">
            Your E-Waste. Your Responsibility. Your{" "}
            <span className="text-[#2ECC71]">Impact</span>
          </p>
          <div className="mt-8 flex items-center justify-center">
            <Motion.div
              className="relative mx-auto h-80 w-64 -translate-x-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Motion.div
                className="absolute left-1/2 top-1 h-10 w-44 -translate-x-1/2 rounded-2xl bg-slate-900"
                style={{ transformOrigin: "20% 100%" }}
                animate={{ rotate: [0, -12, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute left-1/2 top-10 h-3 w-24 -translate-x-1/2 rounded-full bg-slate-300" />
              <Motion.div
                className="absolute left-1/2 top-14 h-52 w-40 -translate-x-1/2 rounded-[2rem] bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-lg"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute right-5 top-6 h-20 w-2 rounded-full bg-white/50" />
                <div className="absolute left-6 bottom-6 h-9 w-9 rounded-full bg-white/35" />
              </Motion.div>
              <Motion.div
                className="absolute left-10 top-0 h-7 w-7 rounded-md bg-amber-400 shadow"
                animate={{ y: [0, 52, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <Motion.div
                className="absolute right-12 top-4 h-6 w-10 rounded bg-sky-400 shadow"
                animate={{ y: [0, 48, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
              <Motion.div
                className="absolute left-16 top-6 h-6 w-6 rounded-full bg-rose-400 shadow"
                animate={{ y: [0, 44, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              />
            </Motion.div>
          </div>
          <div className="mt-0 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setShowSplash(false);
                navigate("/");
              }}
              className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                setShowSplash(false);
                navigate("/landing");
              }}
              className="rounded-full border border-emerald-200 bg-white px-6 py-2.5 text-sm font-bold text-emerald-700"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<V0Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard/user"
        element={
          <RoleRoute role="USER">
            <UserDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/dashboard/partner"
        element={
          <RoleRoute role="PARTNER">
            <PartnerDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <RoleRoute role="ADMIN">
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
