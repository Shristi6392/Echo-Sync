import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiBox, FiGrid, FiMapPin, FiRepeat, FiShield } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(() => {
    if (user?.role === "PARTNER") {
      return [
        { label: "Overview", icon: FiGrid, to: "/dashboard/partner" },
        { label: "Transactions", icon: FiRepeat, to: "/dashboard/partner" },
        { label: "Bins", icon: FiBox, to: "/dashboard/partner" },
      ];
    }
    if (user?.role === "ADMIN") {
      return [
        { label: "Analytics", icon: FiShield, to: "/dashboard/admin" },
        { label: "Pickups", icon: FiRepeat, to: "/dashboard/admin" },
        { label: "Bins", icon: FiMapPin, to: "/dashboard/admin" },
      ];
    }
    return [
      { label: "Dashboard", icon: FiGrid, to: "/dashboard/user" },
      { label: "Map", icon: FiMapPin, to: "/dashboard/user" },
      { label: "Rewards", icon: FiBox, to: "/dashboard/user" },
    ];
  }, [user?.role]);

  return (
    <aside
      className={`flex h-screen flex-col bg-white shadow-card transition-all ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div className="font-heading text-xl font-bold text-primary">
          {collapsed ? "E" : "Eco-Sync"}
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:shadow-sm"
                }`
              }
            >
              <Icon className="text-lg" />
              {!collapsed && item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
