import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import api from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";

const COLORS = ["#0F766E", "#22C55E", "#F59E0B", "#EF4444", "#94A3B8"];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [bins, setBins] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    const [analyticsRes, binsRes, pickupsRes, usersRes, partnersRes] =
      await Promise.all([
        api.get("/api/admin/analytics"),
        api.get("/api/admin/bins"),
        api.get("/api/admin/pickups"),
        api.get("/api/admin/users"),
        api.get("/api/admin/partners"),
      ]);
    setAnalytics(analyticsRes.data);
    setBins(binsRes.data);
    setPickups(pickupsRes.data);
    setUsers(usersRes.data);
    setPartners(partnersRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleUpdatePickup = async (pickupId, status) => {
    try {
      setLoading(true);
      await api.put("/api/admin/update-pickup", { pickupId, status });
      toast.success("Pickup updated");
      loadAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const mapCenter = useMemo(() => {
    if (bins.length) {
      return [bins[0].location.lat, bins[0].location.lng];
    }
    return [20.5937, 78.9629];
  }, [bins]);

  const getFillColor = (fill) => {
    if (fill < 50) return "#22C55E";
    if (fill < 80) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={analytics?.totalUsers || 0} />
        <StatCard label="Total Partners" value={analytics?.totalPartners || 0} />
        <StatCard label="Total Waste" value={`${analytics?.totalWaste || 0} kg`} />
        <StatCard label="Total Revenue" value={`${analytics?.totalRevenue || 0} pts`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Monthly Activity">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.monthly || []}>
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#0F766E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Category Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.category || []}
                  dataKey="total"
                  nameKey="_id"
                  innerRadius={50}
                  outerRadius={90}
                >
                  {(analytics?.category || []).map((entry, index) => (
                    <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="All Bins Map">
          <div className="h-64 overflow-hidden rounded-2xl">
            <MapContainer center={mapCenter} zoom={4} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {bins.map((bin) => (
                <CircleMarker
                  key={bin._id}
                  center={[bin.location.lat, bin.location.lng]}
                  radius={12}
                  pathOptions={{ color: getFillColor(bin.binFillLevel) }}
                >
                  <Popup>
                    <p className="font-semibold">{bin.storeName}</p>
                    <p className="text-xs">{bin.ownerName}</p>
                    <p className="text-xs">{bin.binFillLevel}% full</p>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
          <div className="mt-4 space-y-3">
            {bins.map((bin) => (
              <div
                key={`${bin._id}-list`}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-700">{bin.storeName}</p>
                  <p className="text-xs text-slate-500">{bin.ownerName}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bin.binFillLevel < 50
                      ? "bg-secondary/10 text-secondary"
                      : bin.binFillLevel < 80
                      ? "bg-accent/10 text-accent"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {bin.binFillLevel}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Pickup Management">
          <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
            {pickups.map((pickup) => (
              <div
                key={pickup._id}
                className="rounded-xl border border-slate-100 p-4 text-sm"
              >
                <p className="font-semibold text-slate-700">{pickup.item}</p>
                <p className="text-xs text-slate-500">
                  {pickup.address} · {pickup.role}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {pickup.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={loading}
                      onClick={() => handleUpdatePickup(pickup._id, "Approved")}
                      className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary"
                    >
                      Approve
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => handleUpdatePickup(pickup._id, "Rejected")}
                      className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="User Management">
          <div className="space-y-3">
            {users.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                </div>
                <span className="font-semibold text-secondary">
                  {item.points} pts
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Partner Management">
          <div className="space-y-3">
            {partners.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-700">{item.storeName}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                </div>
                <span className="font-semibold text-primary">
                  {item.earnings} pts
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
