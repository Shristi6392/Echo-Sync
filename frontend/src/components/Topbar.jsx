import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 transition hover:shadow-lg">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-slate-900">
          Welcome back, {user?.name || "User"}
        </h1>
        <p className="text-sm text-slate-500">
          Keep up the great work in saving our planet.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
