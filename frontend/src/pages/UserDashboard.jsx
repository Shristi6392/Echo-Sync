import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { toast } from "react-toastify";
import {
  FiAward,
  FiCpu,
  FiMapPin,
  FiRepeat,
  FiTruck,
} from "react-icons/fi";
import api from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../contexts/useAuth";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserDashboard = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [wallet, setWallet] = useState({ points: 0, transactions: [] });
  const [partners, setPartners] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [pickupForm, setPickupForm] = useState({
    item: "",
    weight: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const quickLinks = [
    { id: "ai-scanner", label: "AI Scanner", icon: FiCpu },
    { id: "find-hubs", label: "Find Hubs", icon: FiMapPin },
    { id: "drop-off", label: "Drop-off", icon: FiRepeat },
    { id: "leaderboard", label: "Leaderboard", icon: FiAward },
    { id: "pickup", label: "Pickup", icon: FiTruck },
  ];

  const loadWallet = useCallback(async () => {
    if (!user) return;
    const { data } = await api.get("/api/user/wallet", {
      params: { userId: user._id },
    });
    setWallet(data);
  }, [user]);

  const loadPartners = useCallback(async () => {
    const { data } = await api.get("/api/user/partners");
    setPartners(data);
  }, []);

  const loadLeaderboard = useCallback(async () => {
    const { data } = await api.get("/api/user/leaderboard");
    setLeaderboard(data);
  }, []);

  const loadRewards = useCallback(async () => {
    const { data } = await api.get("/api/user/rewards");
    setRewards(data);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadWallet();
    loadPartners();
    loadLeaderboard();
    loadRewards();
  }, [user, loadWallet, loadPartners, loadLeaderboard, loadRewards]);

  const handleScan = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/api/user/scan", { userId: user._id });
      setScanResult(data);
      toast.success("Scan completed");
      loadWallet();
      loadLeaderboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQr = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/user/generate-qr", {
        userId: user._id,
      });
      setQrCode(data.qrCode);
      toast.success("QR generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "QR generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePickupChange = (event) => {
    setPickupForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handlePickupSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/user/request-pickup", {
        userId: user._id,
        item: pickupForm.item,
        weight: Number(pickupForm.weight),
        address: pickupForm.address,
      });
      toast.success("Pickup request submitted");
      setPickupForm({ item: "", weight: "", address: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Pickup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/user/redeem", {
        userId: user._id,
        rewardId,
      });
      setWallet((prev) => ({ ...prev, points: data.points }));
      toast.success("Reward redeemed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Redeem failed");
    } finally {
      setLoading(false);
    }
  };

  const mapCenter = useMemo(() => {
    if (partners.length) {
      return [partners[0].location.lat, partners[0].location.lng];
    }
    return [20.5937, 78.9629];
  }, [partners]);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-card">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon className="text-base" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Green Points" value={wallet.points} change="+12%" />
        <StatCard label="Carbon Saved" value="0.0 kg CO₂" />
        <StatCard label="Items Recycled" value={wallet.transactions.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div id="ai-scanner" className="scroll-mt-24">
          <SectionCard title="AI-Based E-Waste Scan">
            <form onSubmit={handleScan} className="space-y-4">
              <input
                type="file"
                className="w-full rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                {loading ? "Scanning..." : "Scan Now"}
              </button>
              {scanResult && (
                <div className="rounded-xl bg-background p-4 text-sm text-slate-600">
                  Detected:{" "}
                  <span className="font-semibold">{scanResult.wasteType}</span> ·
                  Points:{" "}
                  <span className="font-semibold">{scanResult.points}</span>
                </div>
              )}
            </form>
          </SectionCard>
        </div>

        <div id="drop-off" className="scroll-mt-24">
          <SectionCard title="Generate QR Code">
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Generate a unique QR for your next drop-off.
              </p>
              <button
                onClick={handleGenerateQr}
                disabled={loading}
                className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md"
              >
                {loading ? "Generating..." : "Generate QR"}
              </button>
              {qrCode && (
                <div className="rounded-xl bg-background p-4 text-sm font-semibold text-slate-700">
                  {qrCode}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Wallet & Transactions">
          <div className="flex items-center justify-between rounded-xl bg-background p-4">
            <div>
              <p className="text-sm text-slate-500">Total Points</p>
              <p className="text-2xl font-semibold text-slate-900">
                {wallet.points}
              </p>
            </div>
            <button
              onClick={loadWallet}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            >
              Refresh
            </button>
          </div>
          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-2">
            {wallet.transactions.map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm transition hover:border-slate-200 hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-700">{txn.qrCode}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-secondary">
                  +{txn.pointsGiven}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div id="find-hubs" className="scroll-mt-24">
          <SectionCard title="Nearby Partner Hubs">
            <div className="h-64 overflow-hidden rounded-2xl">
              <MapContainer center={mapCenter} zoom={5} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {partners.map((partner) => (
                  <Marker
                    key={partner._id}
                    position={[partner.location.lat, partner.location.lng]}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <p className="font-semibold">{partner.storeName}</p>
                      <p className="text-xs">{partner.ownerName}</p>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div id="pickup" className="scroll-mt-24">
          <SectionCard title="Doorstep Pickup">
            <form onSubmit={handlePickupSubmit} className="space-y-3">
              <input
                name="item"
                value={pickupForm.item}
                onChange={handlePickupChange}
                placeholder="Item (Laptop, TV)"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <input
                name="weight"
                value={pickupForm.weight}
                onChange={handlePickupChange}
                placeholder="Weight in kg"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <input
                name="address"
                value={pickupForm.address}
                onChange={handlePickupChange}
                placeholder="Pickup address"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Submit Request
              </button>
            </form>
          </SectionCard>
        </div>

        <div id="leaderboard" className="scroll-mt-24">
          <SectionCard title="Leaderboard">
            <div className="space-y-3">
              {leaderboard.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-700">
                      #{index + 1} {item.name}
                    </p>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </div>
                  <span className="font-semibold text-secondary">
                    {item.points} pts
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Rewards & Redemption">
        <div className="grid gap-4 md:grid-cols-3">
          {rewards.map((reward) => (
            <div
              key={reward._id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-900">{reward.title}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {reward.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {reward.pointsRequired} pts
                </span>
                <button
                  onClick={() => handleRedeem(reward._id)}
                  disabled={loading}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </DashboardLayout>
  );
};

export default UserDashboard;
