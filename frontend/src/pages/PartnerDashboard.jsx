import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { toast } from "react-toastify";
import api from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../contexts/useAuth";

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [partnerId, setPartnerId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [pointsGiven, setPointsGiven] = useState(50);
  const [binStatus, setBinStatus] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [earnings, setEarnings] = useState({ weekly: [], monthly: [] });
  const [pickupAddress, setPickupAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPartnerData = useCallback(async () => {
    if (!partnerId) return;
    const [binRes, txnRes, earnRes] = await Promise.all([
      api.get("/api/partner/bin-status", { params: { partnerId } }),
      api.get("/api/partner/transactions", { params: { partnerId } }),
      api.get("/api/partner/earnings", { params: { partnerId } }),
    ]);
    setBinStatus(binRes.data.binFillLevel);
    setTransactions(txnRes.data);
    setEarnings(earnRes.data);
  }, [partnerId]);

  useEffect(() => {
    if (user?.partnerId && !partnerId) {
      setPartnerId(user.partnerId);
    }
  }, [user, partnerId]);

  useEffect(() => {
    loadPartnerData();
  }, [loadPartnerData]);

  const handleScan = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/partner/scan-qr", {
        qrCode,
        partnerId,
        pointsGiven,
      });
      toast.success("Points added");
      setQrCode("");
      loadPartnerData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBinPickup = async () => {
    try {
      setLoading(true);
      await api.post("/api/partner/request-bin-pickup", {
        partnerId,
        address: pickupAddress,
      });
      toast.success("Pickup request sent");
      setPickupAddress("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-5 shadow-card">
        <p className="text-sm font-semibold text-slate-500">Active Partner ID</p>
        <input
          value={partnerId}
          onChange={(event) => setPartnerId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          placeholder="Paste partnerId from seed data"
        />
        <p className="mt-2 text-xs text-slate-400">
          Logged in as {user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Bin Fill Level" value={`${binStatus}%`} />
        <StatCard label="Transactions" value={transactions.length} />
        <StatCard label="Weekly Earnings" value={`${earnings.weekly.reduce((a, b) => a + b.total, 0)} pts`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="QR Scanner">
          <form onSubmit={handleScan} className="space-y-3">
            <input
              value={qrCode}
              onChange={(event) => setQrCode(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="Enter QR code"
              required
            />
            <input
              type="number"
              value={pointsGiven}
              onChange={(event) => setPointsGiven(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="Points to add"
            />
            <button
              type="submit"
              disabled={loading || !partnerId}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Add Points
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Bin Fill Status">
          <div className="space-y-4">
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-secondary"
                style={{ width: `${binStatus}%` }}
              />
            </div>
            <p className="text-sm text-slate-600">
              Current fill level: <span className="font-semibold">{binStatus}%</span>
            </p>
            <input
              value={pickupAddress}
              onChange={(event) => setPickupAddress(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="Pickup address"
            />
            <button
              onClick={handleBinPickup}
              disabled={loading || !partnerId}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Request Bin Pickup
            </button>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Daily Transactions">
          <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
            {transactions.map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-700">{txn.qrCode}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-secondary">
                  +{txn.pointsGiven}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Earnings Chart">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earnings.weekly}>
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
};

export default PartnerDashboard;
