import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiGift,
  FiGlobe,
  FiMapPin,
  FiShield,
  FiTruck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { motion } from "framer-motion";
import earthImage from "../assets/earth.png";

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState("AI Scanner");
  const [activeRole, setActiveRole] = useState("Citizen");
  const [impactWeight, setImpactWeight] = useState(2);
  const [openFaq, setOpenFaq] = useState(0);
  const Motion = motion;

  const features = [
    {
      icon: FiCpu,
      title: "AI Scanner",
      desc: "Identify e-waste and estimate reward points instantly.",
      detail:
        "Upload a photo to classify devices and see instant reward points and recycling tips.",
    },
    {
      icon: FiMapPin,
      title: "Micro-Hubs",
      desc: "Locate the nearest drop-off partners around you.",
      detail:
        "Find verified partners on the map and plan the fastest drop-off route.",
    },
    {
      icon: FiGift,
      title: "Reward Wallet",
      desc: "Redeem points for eco-friendly rewards.",
      detail:
        "Track points in real time and redeem for vouchers, gifts, or donations.",
    },
    {
      icon: FiTruck,
      title: "Pickup Requests",
      desc: "Schedule doorstep collection for large appliances.",
      detail:
        "Request pickup in seconds and track approval status from your dashboard.",
    },
  ];

  const roleContent = {
    Citizen: {
      title: "For Citizens",
      points: "Earn points, book pickups, and track your eco-rank.",
      cta: "Explore citizen dashboard",
    },
    Partner: {
      title: "For Partners",
      points: "Scan QR drops, track bin fill levels, and manage earnings.",
      cta: "Explore partner dashboard",
    },
    Admin: {
      title: "For Admins",
      points: "Monitor city-wide metrics, pickups, and hub performance.",
      cta: "Explore admin dashboard",
    },
  };

  const impactStats = useMemo(() => {
    const points = Math.round(impactWeight * 120);
    const items = Math.max(1, Math.round(impactWeight * 2));
    const carbon = (impactWeight * 1.8).toFixed(1);
    return { points, items, carbon };
  }, [impactWeight]);
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 transition hover:shadow-lg">
        <div className="font-heading text-2xl font-bold text-primary">
          Eco-Sync
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Signup
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Smart E-Waste Management
          </p>
          <h1 className="font-heading text-4xl font-bold text-slate-900 lg:text-5xl">
            Turn e-waste into impact with points, pickups, and smarter recycling.
          </h1>
          <p className="text-lg text-slate-600">
            Eco-Sync connects citizens, partners, and admins to optimize recycling
            workflows, reward green actions, and track city-wide impact.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
            >
              View Dashboards
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-2xl font-semibold text-slate-900">
                {impactStats.carbon}kg
              </p>
              <p className="text-xs text-slate-500">Carbon Saved</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-2xl font-semibold text-slate-900">
                {impactStats.items}
              </p>
              <p className="text-xs text-slate-500">Items Recycled</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-2xl font-semibold text-slate-900">
                {impactStats.points}
              </p>
              <p className="text-xs text-slate-500">Reward Points</p>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Impact Simulator
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {impactWeight.toFixed(1)} kg e-waste
                </p>
              </div>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                +{impactStats.points} pts
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={impactWeight}
              onChange={(event) => setImpactWeight(Number(event.target.value))}
              className="mt-4 w-full accent-primary"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-background p-3">
                CO₂ saved:{" "}
                <span className="font-semibold text-slate-900">
                  {impactStats.carbon} kg
                </span>
              </div>
              <div className="rounded-2xl bg-background p-3">
                Items recycled:{" "}
                <span className="font-semibold text-slate-900">
                  {impactStats.items}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-slate-900">
                Eco Globe
              </h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Live
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Circular economy in motion.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <Motion.img
                src={earthImage}
                alt="Recycling globe"
                className="h-56 w-56 object-contain"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-slate-900">
                Smart Bin
              </h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Active
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Watch e-waste drop in and earn instant rewards.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <Motion.div
                className="relative h-48 w-40"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Motion.div
                  className="absolute left-1/2 top-2 h-6 w-32 -translate-x-1/2 rounded-xl bg-slate-800"
                  style={{ transformOrigin: "20% 100%" }}
                  animate={{ rotate: [0, -12, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute left-1/2 top-7 h-2 w-20 -translate-x-1/2 rounded-full bg-slate-900/80" />
                <Motion.div
                  className="absolute left-1/2 top-10 h-32 w-28 -translate-x-1/2 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-lg"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute right-3 top-4 h-16 w-2 rounded-full bg-white/30" />
                  <div className="absolute left-4 bottom-4 h-6 w-6 rounded-full bg-white/20" />
                </Motion.div>
                <Motion.div
                  className="absolute left-8 top-0 h-5 w-5 rounded-md bg-amber-400 shadow"
                  animate={{ y: [0, 40, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <Motion.div
                  className="absolute right-10 top-2 h-4 w-7 rounded bg-sky-400 shadow"
                  animate={{ y: [0, 36, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                />
                <Motion.div
                  className="absolute left-14 top-4 h-4 w-4 rounded-full bg-rose-400 shadow"
                  animate={{ y: [0, 34, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                />
              </Motion.div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-heading text-xl font-semibold text-slate-900">
              Core Features
            </h2>
            <div className="mt-6 space-y-3">
              {features.map((item) => {
                const Icon = item.icon;
                const isActive = activeFeature === item.title;
                return (
                  <button
                    key={item.title}
                    onClick={() => setActiveFeature(item.title)}
                    className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-background text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`rounded-xl p-3 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p
                        className={`text-sm ${
                          isActive ? "text-white/80" : "text-slate-600"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 rounded-2xl bg-background p-4 text-sm text-slate-600">
              {features.find((item) => item.title === activeFeature)?.detail}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-heading text-xl font-semibold text-slate-900">
              Who are you?
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.keys(roleContent).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeRole === role
                      ? "bg-primary text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-background p-4">
              <p className="font-semibold text-slate-900">
                {roleContent[activeRole].title}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {roleContent[activeRole].points}
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                {roleContent[activeRole].cta}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-primary p-6 text-white shadow-card">
            <h3 className="font-heading text-xl font-semibold">
              Ready to sync your city?
            </h3>
            <p className="mt-2 text-sm text-white/80">
              Join Eco-Sync and start tracking real impact in minutes.
            </p>
            <Link
              to="/signup"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-6 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-slate-900">
            FAQ
          </h2>
          <span className="text-sm text-slate-500">
            Tap a question to expand
          </span>
        </div>
        {[
          {
            question: "How do I earn points?",
            answer:
              "Scan items, drop off at partner hubs, or request pickups. Points are added instantly.",
          },
          {
            question: "Do partners need special hardware?",
            answer:
              "No. Partners can scan QR codes directly from their dashboard and update bin status.",
          },
          {
            question: "Can I redeem rewards immediately?",
            answer:
              "Yes, once you reach the required points you can redeem from the rewards section.",
          },
        ].map((item, index) => (
          <button
            key={item.question}
            onClick={() => setOpenFaq(index === openFaq ? -1 : index)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{item.question}</p>
              <span className="text-xl text-slate-400">
                {openFaq === index ? "−" : "+"}
              </span>
            </div>
            {openFaq === index && (
              <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
            )}
          </button>
        ))}
      </section>
    </div>
  );
};

export const V0Landing = () => {
  const highlights = [
    {
      icon: FiZap,
      title: "Instant AI insights",
      desc: "Classify e-waste, estimate rewards, and see disposal guidance in seconds.",
    },
    {
      icon: FiUsers,
      title: "Citizen-first experience",
      desc: "Book pickups, earn points, and track impact from a simple dashboard.",
    },
    {
      icon: FiShield,
      title: "Verified partners",
      desc: "Coordinate with trusted micro-hubs and keep your city compliant.",
    },
    {
      icon: FiGlobe,
      title: "City-wide visibility",
      desc: "Track pickups, bin capacity, and rewards across regions.",
    },
  ];

  const steps = [
    {
      title: "Scan & log",
      desc: "Capture device details or scan QR codes to log every drop-off.",
    },
    {
      title: "Earn rewards",
      desc: "Automatically calculate points and unlock sustainable perks.",
    },
    {
      title: "Close the loop",
      desc: "Monitor pickups, partner bins, and compliance in real time.",
    },
  ];

  const stats = [
    { label: "Items tracked", value: "28K+" },
    { label: "Partner hubs", value: "180+" },
    { label: "Rewards issued", value: "1.2M" },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="font-heading text-2xl font-semibold text-primary">
          Eco-Sync
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#features" className="text-slate-500 hover:text-slate-900">
            Features
          </a>
          <a href="#process" className="text-slate-500 hover:text-slate-900">
            Process
          </a>
          <a href="#impact" className="text-slate-500 hover:text-slate-900">
            Impact
          </a>
          <Link
            to="/signup"
            className="rounded-full bg-primary px-4 py-2 font-semibold text-white"
          >
            Start now
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary">
            Sustainable operations
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Create an end-to-end e-waste journey with real rewards.
          </h1>
          <p className="text-lg text-slate-600">
            Eco-Sync connects citizens, partners, and city teams to streamline
            recycling logistics, automate incentives, and keep impact visible.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
            >
              Back to app
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Get started
              <FiArrowRight />
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-500">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
            <p className="text-sm font-semibold text-secondary">
              Live pickup board
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              36 pickups scheduled today
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Automated routing keeps hubs balanced and rewards on time.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
              <p className="text-xs uppercase text-slate-500">Rewards</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                +48,200 pts
              </p>
              <p className="text-sm text-slate-600">Issued this week</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
              <p className="text-xs uppercase text-slate-500">Compliance</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">98.4%</p>
              <p className="text-sm text-slate-600">Verified handoffs</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-6xl space-y-6 px-6 py-12"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-semibold text-slate-900">
            Everything teams need to run eco-ops.
          </h2>
          <span className="text-sm text-slate-500">
            Designed for every role
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card"
              >
                <div className="flex items-center gap-3 text-secondary">
                  <div className="rounded-2xl bg-secondary/10 p-3">
                    <Icon />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="process"
        className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-2"
      >
        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-semibold text-slate-900">
            A clear path from drop-off to impact.
          </h2>
          <p className="text-sm text-slate-600">
            Keep citizens motivated and partners coordinated with a workflow
            that never loses track of the data or the rewards.
          </p>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
              >
                <FiCheckCircle className="mt-1 text-secondary" />
                <div>
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <h3 className="font-heading text-xl font-semibold text-slate-900">
            Live role insights
          </h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-background px-4 py-3">
              <span>Citizen rewards issued</span>
              <span className="font-semibold text-slate-900">+14%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-background px-4 py-3">
              <span>Partner bin capacity</span>
              <span className="font-semibold text-slate-900">72%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-background px-4 py-3">
              <span>Admin pickups resolved</span>
              <span className="font-semibold text-slate-900">220</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="impact"
        className="mx-auto max-w-6xl space-y-6 px-6 py-12"
      >
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <h3 className="font-heading text-3xl font-semibold text-slate-900">
            Ready to launch your eco-sync program?
          </h3>
          <p className="mt-3 text-sm text-slate-600">
            Bring your city online with smarter pickups, better rewards, and
            real-time transparency.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white"
            >
              Create account
            </Link>
            <Link
              to="/"
              className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700"
            >
              Go to app
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
