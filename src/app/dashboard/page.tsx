"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import {
  Package, Gift, Users, Star, Zap, BookOpen, ArrowRight,
  Calendar, CreditCard, SkipForward, Settings2, ChevronRight,
  Medal, Handshake, ListChecks, LayoutDashboard, CheckCircle2,
  TrendingUp, Activity, HeartPulse, UtensilsCrossed,
  GraduationCap, UserPlus, Microscope, Clock,
} from "lucide-react";

// ─── Animated counter ─────────────────────────────────────────────────────────
function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const v = useMotionValue(0);
  const rounded = useTransform(v, n => Math.round(n));
  const [val, setVal] = useState(0);
  useEffect(() => {
    rounded.on("change", setVal);
    const c = animate(v, to, { duration, delay: 0.2, ease: "easeOut" });
    return () => { c.stop(); rounded.destroy(); };
  }, [to]);
  return <>{val}</>;
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 54, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 136, height: 136 }}>
      <svg width="136" height="136" viewBox="0 0 136 136" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
        <motion.circle
          cx="68" cy="68" r={r} fill="none"
          stroke="var(--gold)" strokeWidth="9" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${(score / 100) * circ} ${circ}` }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 8px rgba(196,162,86,.6))" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, color: "white" }}>
          <CountUp to={score} />
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: "rgba(255,255,255,0.45)" }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data }: { data: number[] }) {
  const W = 200, H = 44;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - 4 - ((v - min) / range) * (H - 10),
  }));
  const d    = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = d + ` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spk)" />
      <path d={d} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2}
          fill={i === pts.length - 1 ? "var(--green)" : "white"}
          stroke="var(--green)" strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({ children, className = "", style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", ...style }}
    >
      {children}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "var(--green)", icon: Icon }: {
  label: string; value: React.ReactNode; sub?: string; color?: string; icon?: React.ElementType;
}) {
  const iconBg = color === "var(--green)" ? "var(--green-bg)" : color === "var(--gold)" ? "var(--gold-bg)" : color === "var(--violet)" ? "var(--violet-bg)" : `${color}18`;
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}
      style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: `3px solid ${color}`, borderRadius: 20, boxShadow: "var(--shadow)", overflow: "hidden", minWidth: 0 }}
    >
      <div style={{ padding: "22px 22px 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--ink-4)", lineHeight: 1.3 }}>
            {label}
          </p>
          {Icon && (
            <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: iconBg }}>
              <Icon size={16} style={{ color }} />
            </div>
          )}
        </div>
        <p style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, color, letterSpacing: "-0.04em" }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: 12, marginTop: 10, lineHeight: 1.4, color: "var(--ink-4)" }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const scoreHistory = [42, 48, 55, 59, 64, 68, 71, 74];

const metricData = [
  { label: "Digestion", value: 82, color: "#2d6a4f", icon: Activity },
  { label: "Energy",    value: 71, color: "#4a8c6a", icon: Zap },
  { label: "Immunity",  value: 68, color: "#52796f", icon: TrendingUp },
  { label: "Inflam.",   value: 76, color: "#c4a256", icon: CheckCircle2 },
];

const rewardItems = [
  { m: 1,  label: "Welcome kit",  val: "$58+", done: true },
  { m: 2,  label: "Glass jar",    val: "$25",  done: true },
  { m: 3,  label: "Travel pouch", val: "$20",  current: true },
  { m: 4,  label: "Enamel pin",   val: "$15" },
  { m: 5,  label: "Journal",      val: "$22" },
  { m: 6,  label: "Lab panel",    val: "$120", milestone: true },
  { m: 7,  label: "Herb garden",  val: "$18" },
  { m: 8,  label: "Tote bag",     val: "$20" },
  { m: 9,  label: "Recipe book",  val: "$15" },
  { m: 10, label: "New SKU",      val: "$30+" },
  { m: 11, label: "Branded hat",  val: "$28" },
  { m: 12, label: "Anniv. box",   val: "$85+", milestone: true },
];

const partnerData = [
  { name: "Everlywell",    cat: "Lab Testing", deal: "40% off any panel",     val: "$80+", color: "#1b3d2f", featured: true },
  { name: "Thrive Market", cat: "Nutrition",   deal: "Free 30-day + 25% off", val: "$60+", color: "#2d6a4f" },
  { name: "Calm",          cat: "Wellness",    deal: "40% off annual plan",   val: "$28",  color: "#52796f" },
  { name: "LMNT",          cat: "Nutrition",   deal: "Free 8-pack sample",    val: "$15",  color: "#c45a3c" },
  { name: "ClassPass",     cat: "Fitness",     deal: "50% off first month",   val: "$50+", color: "#4a8c6a" },
  { name: "Oura Ring",     cat: "Tracking",    deal: "$50 off any ring",      val: "$50",  color: "#96968a" },
];

const TABS = [
  { id: "overview",  label: "Overview",   icon: LayoutDashboard },
  { id: "checkin",   label: "Check-in",   icon: HeartPulse },
  { id: "lessons",   label: "Lessons",    icon: GraduationCap },
  { id: "kitchen",   label: "Kitchen",    icon: UtensilsCrossed },
  { id: "library",   label: "Library",    icon: BookOpen },
  { id: "rewards",   label: "Rewards",    icon: Medal },
  { id: "perks",     label: "Perks",      icon: Handshake },
  { id: "protocol",  label: "Protocol",   icon: ListChecks },
];

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Top stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, minWidth: 0 }}>
        <StatCard
          label="Resilience Score"
          value={<CountUp to={74} />}
          sub="↑ +7 pts this month"
          color="var(--green)"
          icon={TrendingUp}
        />
        <StatCard
          label="Active Month"
          value="3"
          sub="Since March 2026"
          color="#52796f"
          icon={Calendar}
        />
        <StatCard
          label="Points Balance"
          value="280"
          sub="★ Rewards points"
          color="var(--gold)"
          icon={Star}
        />
        <StatCard
          label="Saved So Far"
          value="$24"
          sub="vs standard pricing"
          color="var(--violet)"
          icon={CreditCard}
        />
      </div>

      {/* Score detail + metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, minWidth: 0 }}>

        {/* Score card */}
        <Card style={{ background: "linear-gradient(160deg, var(--navy) 0%, #1e4a36 60%, #2d6a4f 100%)", padding: 28, display: "flex", flexDirection: "column", gap: 20, border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Resilience Score™</p>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}>
              ↑ +7 pts
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <ScoreRing score={74} />
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>8-month trend</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>42 → 74</p>
              </div>
              <Sparkline data={scoreHistory} />
            </div>
          </div>
        </Card>

        {/* 4 metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, minWidth: 0 }}>
          {metricData.map((m, idx) => {
            const grade = m.value >= 80 ? "Excellent" : m.value >= 70 ? "Good" : "Fair";
            const gradeColor = grade === "Excellent" ? "var(--green)" : grade === "Good" ? "#52796f" : "var(--gold)";
            return (
              <motion.div
                key={m.label}
                whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.09)" }}
                style={{ minWidth: 0, borderRadius: 20, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", borderTop: `3px solid ${m.color}`, boxShadow: "var(--shadow)" }}
              >
                <div style={{ padding: "22px 22px 22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0, flex: 1 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${m.color}15` }}>
                        <m.icon size={14} style={{ color: m.color }} />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{m.label}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, flexShrink: 0, background: `${gradeColor}15`, color: gradeColor, border: `1px solid ${gradeColor}30` }}>
                      {grade}
                    </span>
                  </div>
                  <p style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: m.color, letterSpacing: "-0.03em" }}>
                    <CountUp to={m.value} duration={1.2} />
                    <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 3, color: "var(--ink-4)" }}>/100</span>
                  </p>
                  <div>
                    <div style={{ height: 7, borderRadius: 999, overflow: "hidden", background: "var(--border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ duration: 1.1, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${m.color}70, ${m.color})` }}
                      />
                    </div>
                    <p style={{ fontSize: 12, marginTop: 7, color: "var(--ink-4)", fontWeight: 500 }}>
                      {m.value >= 80 ? "🌿 Excellent progress" : m.value >= 70 ? "✓ On track" : "↗ Room to improve"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gift banner */}
      <motion.div
        whileHover={{ scale: 1.006, boxShadow: "0 6px 20px rgba(196,162,86,.22)" }}
        whileTap={{ scale: 0.998 }}
        style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", borderRadius: 20, cursor: "pointer", background: "linear-gradient(135deg, var(--gold-bg) 0%, #fef8e7 100%)", border: "1px solid var(--gold-rim)", boxShadow: "var(--shadow)" }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#FEF3C7", boxShadow: "0 2px 10px rgba(196,162,86,.3)" }}>
          <Gift size={22} style={{ color: "var(--gold)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 4 }}>Month 3 gift ships Jun 15</p>
          <p style={{ fontSize: 13, color: "#92400E" }}>
            Resilia® travel pouch — included with your next order
          </p>
        </div>
        <ChevronRight size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
      </motion.div>

      {/* Subscription card */}
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}>

        {/* ── Dark header band ── */}
        <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", padding: "32px 40px 28px 40px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
            <div style={{ minWidth: 0 }}>
              {/* Status badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, marginBottom: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                  Active Subscription
                </span>
              </div>
              {/* Product name */}
              <p style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4 }}>
                Oil of Oregano
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--gold)", marginBottom: 12 }}>
                Loading Protocol
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
                4 softgels / day · Renews Jun 15, 2026
              </p>
            </div>

            {/* Price box */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p style={{ fontSize: 38, fontWeight: 800, color: "white", lineHeight: 1, letterSpacing: "-0.04em" }}>$79.99</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>per month</p>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--border)" }}>
          {[
            { icon: Calendar,   label: "Next Order",   value: "Jun 15, 2026", color: "var(--green)", bg: "var(--green-bg)" },
            { icon: Package,    label: "Orders Done",  value: "3 completed",  color: "#52796f",      bg: "var(--violet-bg)" },
            { icon: CreditCard, label: "Saved So Far", value: "$24.00",       color: "var(--gold)",  bg: "var(--gold-bg)" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 28px", background: "var(--surface)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: s.bg, flexShrink: 0 }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 5 }}>{s.label}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div style={{ padding: "20px 40px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, background: "var(--subtle)", borderTop: "1px solid var(--border)" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "var(--green)", color: "white", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(45,106,79,.35)" }}
          >
            <SkipForward size={14} /> Skip next order
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, background: "var(--surface)", color: "var(--navy)", border: "1px solid var(--border)", cursor: "pointer" }}
          >
            <Settings2 size={14} /> Update frequency
          </motion.button>
          <Link href="/cancel" style={{ marginLeft: "auto" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-3)", background: "transparent", border: "none", cursor: "pointer" }}>
              Manage / Cancel <ChevronRight size={13} />
            </button>
          </Link>
        </div>
      </div>

      {/* Earn points */}
      <div style={{ borderRadius: 20, background: "var(--subtle)", border: "1px solid var(--border)", padding: "32px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Earn Points</h2>
        <p style={{ fontSize: 14, color: "var(--ink-4)", marginBottom: 24 }}>Complete actions to grow your rewards balance</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { icon: Users,         label: "Refer a friend",  pts: 500, color: "#2d6a4f", bg: "#edf7f1" },
            { icon: Star,          label: "Leave a review",  pts: 40,  color: "#c4a256", bg: "#faf4e4" },
            { icon: GraduationCap, label: "Complete lesson",  pts: 20,  color: "#52796f", bg: "#eef4f2" },
            { icon: Zap,           label: "Weekly check-in",  pts: 25,  color: "#4a8c6a", bg: "#edf7f1" },
          ].map(a => (
            <motion.div
              key={a.label}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,.10)" }}
              whileTap={{ scale: 0.97 }}
              style={{ borderRadius: 16, padding: "24px 20px 24px 24px", cursor: "pointer", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: a.bg, boxShadow: `0 2px 8px ${a.color}30` }}>
                <a.icon size={20} style={{ color: a.color }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--navy)" }}>{a.label}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: a.color }}>+{a.pts} pts</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Biomarker tracking */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>Biomarker tracking</h2>
          <p style={{ fontSize: 14, color: "var(--ink-4)" }}>Real lab results — real proof your protocol is working</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {[
            { label: "CRP — Inflammation", val: "2.1", unit: "mg/L", from: "3.4", pct: 38, dir: "↓", good: true, color: "var(--green)" },
            { label: "IgA — Immune function", val: "245", unit: "mg/dL", from: "198", pct: 65, dir: "↑", good: true, color: "#52796f" },
          ].map(b => (
            <Card key={b.label} style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: b.color, marginBottom: 6 }}>{b.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>{b.val} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--ink-4)" }}>{b.unit}</span></p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "var(--green-bg)", color: "var(--green)" }}>{b.dir} from {b.from}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 999, background: b.color }} />
              </div>
            </Card>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderRadius: 16, background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4 }}>Your month 6 lab panel is included free</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>At-home test kit — powered by our lab partner</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "var(--gold)", color: "var(--navy)", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <Microscope size={14} /> View lab partners
          </motion.button>
        </div>
      </div>

      {/* Seasonal protocol */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>Your seasonal protocol</h2>
          <p style={{ fontSize: 14, color: "var(--ink-4)" }}>Dosing adapts to the season — here's your current recommendation</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { s: "Winter", m: "Nov–Feb", d: "Loading · 4/day",      icon: "❄️", active: false },
            { s: "Spring", m: "Mar–Apr", d: "Reset · transition",   icon: "🌱", active: true  },
            { s: "Summer", m: "May–Aug", d: "Sustain · 2/day",      icon: "☀️", active: false },
            { s: "Fall",   m: "Sep–Oct", d: "Fortify · ramp up",    icon: "🍂", active: false },
          ].map(season => (
            <div key={season.s} style={{ position: "relative", borderRadius: 16, padding: "20px 14px", textAlign: "center", background: season.active ? "var(--navy)" : "var(--subtle)", border: season.active ? "2px solid var(--gold)" : "1px solid var(--border)" }}>
              {season.active && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--navy)", fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 999, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>CURRENT</div>}
              <div style={{ fontSize: 22, marginBottom: 8 }}>{season.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: season.active ? "white" : "var(--navy)", marginBottom: 4 }}>{season.s}</p>
              <p style={{ fontSize: 11, color: season.active ? "rgba(255,255,255,0.45)" : "var(--ink-4)", marginBottom: 8 }}>{season.m}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: season.active ? "var(--gold)" : "var(--green)" }}>{season.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness circle + accountability partner */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
        {/* Wellness circle */}
        <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", padding: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ initials: "JM", you: true }, { initials: "TM" }, { initials: "+", add: true }].map((p, i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: p.add ? 18 : 12, fontWeight: 700, flexShrink: 0, background: p.add ? "rgba(255,255,255,0.1)" : p.you ? "var(--gold)" : "var(--green)", color: p.you ? "var(--navy)" : "white", border: p.add ? "2px dashed rgba(255,255,255,0.25)" : "none" }}>{p.initials}</div>
            ))}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 6 }}>Build your wellness circle</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 20 }}>You + Tom M. Invite 1 more to unlock Family Protocol content.</p>
          <motion.button whileHover={{ scale: 1.02 }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700, background: "var(--gold)", color: "var(--navy)", border: "none", cursor: "pointer" }}>
            <UserPlus size={14} /> Invite — 500 pts each
          </motion.button>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ t: "2 members", b: "Shared dashboard", done: true }, { t: "3 members", b: "Family Protocol content", done: false }, { t: "5 members", b: "Group discount tier", done: false }].map(tier => (
              <div key={tier.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderRadius: 10, background: tier.done ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "white" }}>{tier.t}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{tier.b}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: tier.done ? "#4ade80" : "rgba(255,255,255,0.25)" }}>{tier.done ? "✓ Unlocked" : "Locked"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accountability partner */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 16 }}>Accountability partner</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0 }}>SR</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>Sarah R. <span style={{ fontSize: 12, fontWeight: 400, color: "var(--ink-4)" }}>· Month 4</span></p>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "var(--green-bg)", color: "var(--green)" }}>🔥 7-day streak</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "var(--gold-bg)", color: "#8a7030" }}>Score: 79</span>
                </div>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} style={{ width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 600, background: "var(--subtle)", color: "var(--navy)", border: "1px solid var(--border)", cursor: "pointer" }}>
              Send check-in 👋
            </motion.button>
          </div>
          {/* Maximize membership quick links */}
          <div style={{ borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)", marginBottom: 14 }}>Explore your membership</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ icon: GraduationCap, label: "Lessons", desc: "Science-backed learning", id: "lessons" }, { icon: UtensilsCrossed, label: "Kitchen", desc: "Gut-friendly recipes", id: "kitchen" }, { icon: BookOpen, label: "Library", desc: "Articles & expert sessions", id: "library" }].map(l => (
                <motion.div key={l.id} whileHover={{ x: 3 }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "var(--subtle)", cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "var(--green-bg)" }}>
                    <l.icon size={14} style={{ color: "var(--green)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{l.label}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-4)" }}>{l.desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--ink-5)", marginLeft: "auto" }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lessons tab ─────────────────────────────────────────────────────────────
function LessonsTab() {
  const foundations = [
    { n: "01", t: "Your gut microbiome",    color: "var(--green)",  pct: 100 },
    { n: "02", t: "Oregano oil science",    color: "#4a8c6a",       pct: 60  },
    { n: "03", t: "Black seed oil science", color: "#52796f",       pct: 0   },
  ];
  const programs = [
    { t: "Gut reset fundamentals",      l: 6, icon: "🌿", pct: 80 },
    { t: "Immune defense masterclass",  l: 5, icon: "🛡️", pct: 40 },
    { t: "Inflammation decoded",        l: 4, icon: "🔥", pct: 0  },
    { t: "The botanical tradition",     l: 4, icon: "📜", pct: 0  },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Hero */}
      <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", padding: "32px 32px", position: "relative" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, marginBottom: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Resilia® Lessons</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 8, letterSpacing: "-0.02em" }}>Understand your body.<br/>Trust the protocol.</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>Short, science-backed lessons. Earn 20 pts per completion.</p>
      </div>

      {/* Foundation lessons */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>Foundations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {foundations.map(l => (
            <motion.div key={l.n} whileHover={{ y: -2 }} style={{ position: "relative", borderRadius: 16, padding: "20px 18px", background: "var(--subtle)", border: "1px solid var(--border)", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: 8, right: 12, fontSize: 40, fontWeight: 800, color: l.color, opacity: 0.1, lineHeight: 1 }}>{l.n}</div>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: l.color, marginBottom: 6 }}>Lesson {l.n}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 16, lineHeight: 1.3 }}>{l.t}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                  <div style={{ width: `${l.pct}%`, height: "100%", borderRadius: 999, background: l.color }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: l.pct === 100 ? "var(--green)" : "var(--ink-4)" }}>{l.pct === 100 ? "Done ✓" : l.pct > 0 ? `${l.pct}%` : "Start"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Curated programs */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>Curated programs</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {programs.map(p => (
            <motion.div key={p.t} whileHover={{ y: -2 }} style={{ borderRadius: 16, padding: 24, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{p.l} lessons</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 12, lineHeight: 1.3 }}>{p.t}</p>
              <div style={{ height: 5, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 999, background: "var(--green)" }} />
              </div>
              <p style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 6 }}>{p.pct > 0 ? `${p.pct}% complete` : "Not started"}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily ritual */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 6 }}>Your daily protocol</h3>
        <p style={{ fontSize: 14, color: "var(--ink-4)", marginBottom: 16 }}>Make Resilia® part of your rhythm</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Morning", icon: "☀️", steps: ["Wake up", "2 softgels with breakfast", "Start your day resilient"] },
            { title: "Evening", icon: "🌙", steps: ["Wind down", "2 softgels with dinner (loading)", "Gut resets overnight"] },
          ].map(r => (
            <Card key={r.title} style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>{r.title}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {r.steps.map((s, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: j === 1 ? "var(--green)" : "var(--subtle)", color: j === 1 ? "white" : "var(--ink-4)", border: j === 1 ? "none" : "1px solid var(--border)" }}>{j + 1}</div>
                    <span style={{ fontSize: 13, fontWeight: j === 1 ? 600 : 400, color: j === 1 ? "var(--navy)" : "var(--ink-4)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Kitchen tab ──────────────────────────────────────────────────────────────
function KitchenTab() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Anti-inflammatory", "Gut repair", "Immune boost", "Prebiotic", "Fermented"];
  const recipes = [
    { t: "Fermented kimchi bowl with black seed dressing",       tags: ["Fermented"],          time: "25 min", color: "var(--green)",  emoji: "🥘" },
    { t: "Mediterranean roasted vegetables with wild oregano",   tags: ["Anti-inflammatory"],   time: "35 min", color: "#4a8c6a",       emoji: "🥗" },
    { t: "Prebiotic overnight oats with cinnamon and flax",      tags: ["Prebiotic"],           time: "5 min",  color: "#52796f",       emoji: "🥣" },
    { t: "Immune-boosting garlic ginger miso soup",              tags: ["Immune boost"],        time: "20 min", color: "var(--navy)",   emoji: "🍜" },
    { t: "Anti-inflammatory golden milk latte",                  tags: ["Anti-inflammatory"],   time: "5 min",  color: "#8a7030",       emoji: "☕" },
    { t: "Gut-healing sauerkraut avocado toast",                 tags: ["Fermented", "Gut repair"], time: "10 min", color: "var(--green)", emoji: "🥑" },
  ];
  const filtered = filter === "All" ? recipes : recipes.filter(r => r.tags.includes(filter));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Hero */}
      <div style={{ borderRadius: 20, background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", padding: "32px 32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, marginBottom: 14, background: "var(--gold-bg)", border: "1px solid var(--gold-rim)" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#8a7030", letterSpacing: "0.08em", textTransform: "uppercase" }}>New · May 2026</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>The Resilia® Kitchen</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>Gut-friendly, anti-inflammatory recipes designed to complement your protocol.</p>
      </div>

      {/* Featured recipe */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>This month&apos;s protocol recipe</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ borderRadius: 20, padding: 28, background: "var(--subtle)", border: "1px solid var(--border)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, marginBottom: 14, background: "var(--gold-bg)", border: "1px solid var(--gold-rim)" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8a7030" }}>May 2026</span>
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 8, lineHeight: 1.35, letterSpacing: "-0.01em" }}>Turmeric-ginger bone broth with oregano oil drizzle</h4>
            <p style={{ fontSize: 13, color: "var(--ink-4)", lineHeight: 1.6, marginBottom: 16 }}>Curcumin synergizes with carvacrol for enhanced gut-soothing benefits.</p>
            <div style={{ display: "flex", gap: 20 }}>
              {[{ l: "Prep", v: "10 min" }, { l: "Cook", v: "45 min" }, { l: "Serves", v: "4" }].map(m => (
                <div key={m.l}><p style={{ fontSize: 10, color: "var(--ink-4)", marginBottom: 2 }}>{m.l}</p><p style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{m.v}</p></div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[{ i: "🌿", l: "Anti-inflammatory" }, { i: "🦠", l: "Gut-friendly" }, { i: "🛡️", l: "Immune boost" }].map(t => (
                <div key={t.l} style={{ borderRadius: 10, padding: "10px 8px", textAlign: "center", background: "var(--subtle)" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{t.i}</div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--green)" }}>{t.l}</p>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, borderRadius: 14, padding: "16px 18px", background: "var(--green-bg)", border: "1px solid var(--green-rim)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--green)", marginBottom: 8 }}>Why this pairs with Resilia®</p>
              <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6 }}>Turmeric&apos;s curcumin and ginger&apos;s gingerols work alongside oregano oil&apos;s carvacrol. Bone broth provides glutamine for gut lining repair.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe library */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)" }}>Recipe library</h3>
          <p style={{ fontSize: 13, color: "var(--ink-4)" }}>Browse by what your body needs</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontWeight: 600, background: filter === c ? "var(--green)" : "var(--surface)", color: filter === c ? "white" : "var(--ink-4)", border: filter === c ? "none" : "1px solid var(--border)", transition: "all 0.15s" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {filtered.map((r, i) => (
            <motion.div key={r.t} whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }} style={{ borderRadius: 16, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", cursor: "pointer" }}>
              <div style={{ height: 72, background: r.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, opacity: 0.5 }}>{r.emoji}</span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", lineHeight: 1.35, marginBottom: 8 }}>{r.t}</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                  {r.tags.map(tag => <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "var(--green-bg)", color: "var(--green)" }}>{tag}</span>)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} style={{ color: "var(--ink-5)" }} />
                  <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{r.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ingredient spotlight */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 6 }}>Ingredient spotlight</h3>
        <p style={{ fontSize: 14, color: "var(--ink-4)", marginBottom: 16 }}>Synergy between what you eat and what you take</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[{ n: "Turmeric", w: "Curcumin synergizes with carvacrol", i: "🟡" }, { n: "Ginger", w: "Supports digestive motility", i: "🫚" }, { n: "Fermented foods", w: "Rebuild diverse gut flora", i: "🫙" }, { n: "Prebiotic fiber", w: "Feeds beneficial bacteria", i: "🌾" }].map(ing => (
            <div key={ing.n} style={{ borderRadius: 14, padding: "18px 14px", textAlign: "center", background: "var(--subtle)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{ing.i}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>{ing.n}</p>
              <p style={{ fontSize: 11, color: "var(--ink-4)", lineHeight: 1.5 }}>{ing.w}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Library tab ──────────────────────────────────────────────────────────────
function LibraryTab() {
  const [cat, setCat] = useState("All");
  const categories = ["All", "Gut health", "Immune defense", "Inflammation", "Botanicals", "Wellness"];
  const articles = {
    "Gut health": [
      { t: "How carvacrol breaks down biofilms",        time: "6 min" },
      { t: "Why bloating isn't normal",                  time: "5 min" },
      { t: "The microbiome rebalancing timeline",        time: "7 min" },
    ],
    "Immune defense": [
      { t: "82 trials: the science of black seed oil",   time: "10 min" },
      { t: "Seasonal immunity explained",                time: "6 min" },
      { t: "Thymoquinone: the compound behind it all",   time: "8 min" },
    ],
  };
  const colors = ["var(--green)", "#4a8c6a", "#52796f"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ fontSize: 12, padding: "7px 16px", borderRadius: 999, cursor: "pointer", fontWeight: 600, background: cat === c ? "var(--navy)" : "var(--surface)", color: cat === c ? "white" : "var(--ink-4)", border: cat === c ? "none" : "1px solid var(--border)", transition: "all 0.15s" }}>{c}</button>
        ))}
      </div>

      {/* Featured articles */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div style={{ borderRadius: 20, overflow: "hidden", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", cursor: "pointer" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Featured</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Gut health</span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.35, marginBottom: 8, letterSpacing: "-0.01em" }}>The gut-immune axis: how your microbiome controls 70% of your immune system</h3>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>By Resilia® Science · 8 min read</p>
        </div>
        <div style={{ borderRadius: 20, overflow: "hidden", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, background: "var(--subtle)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--gold-bg)", border: "1px solid var(--gold-rim)", color: "#8a7030", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, alignSelf: "flex-start" }}>New</span>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", lineHeight: 1.35, marginBottom: 6, letterSpacing: "-0.01em" }}>Your microbiome&apos;s circadian rhythm</h3>
          <p style={{ fontSize: 11, color: "var(--ink-4)" }}>7 min read</p>
        </div>
      </div>

      {/* Article sections */}
      {(cat === "All" ? ["Gut health", "Immune defense"] : [cat]).filter(c => articles[c as keyof typeof articles]).map(section => (
        <div key={section}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>{section}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {articles[section as keyof typeof articles].map((a, i) => (
              <motion.div key={a.t} whileHover={{ y: -2 }} style={{ borderRadius: 16, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", cursor: "pointer" }}>
                <div style={{ height: 60, background: colors[i] }} />
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: colors[i], textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{section}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", lineHeight: 1.35, marginBottom: 8 }}>{a.t}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} style={{ color: "var(--ink-5)" }} />
                    <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{a.time} read</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Expert sessions */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 6 }}>Expert sessions</h3>
        <p style={{ fontSize: 14, color: "var(--ink-4)", marginBottom: 16 }}>Monthly live Q&As with naturopathic doctors</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { t: "Oregano oil and your gut",   dr: "Dr. Maria Santos, ND", live: true  },
            { t: "Seasonal immunity prep",      dr: "Dr. James Chen, ND",   live: false },
          ].map(s => (
            <div key={s.t} style={{ borderRadius: 16, padding: 24, background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", color: "white" }}>
              {s.live
                ? <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(232,93,84,0.2)", color: "#e85d54", letterSpacing: "0.06em" }}>● Live — June 1st</span>
                : <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>Recording</span>
              }
              <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: "12px 0 4px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{s.t}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{s.dr}</p>
              <motion.button whileHover={{ scale: 1.03 }} style={{ padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", border: s.live ? "none" : "1px solid rgba(255,255,255,0.15)", background: s.live ? "var(--gold)" : "transparent", color: s.live ? "var(--navy)" : "white" }}>
                {s.live ? "Register — 20 pts" : "Watch recording"}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Rewards tab ──────────────────────────────────────────────────────────────
function RewardsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Header stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <StatCard label="Total Program Value" value="$470+" color="var(--green)" sub="Free gifts · $0 extra cost" />
        <StatCard label="Gifts Unlocked"       value="2"     color="#52796f"      sub="Months 1 & 2 complete" />
        <StatCard label="Next Gift"            value="$20"   color="var(--gold)"  sub="Travel pouch · Jun 15" />
      </div>

      {/* Grid */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--navy)" }}>Rewards Roadmap</h2>
        <p style={{ fontSize: 14, marginBottom: 24, color: "var(--ink-4)" }}>Stay on protocol — unlock gifts every month</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {rewardItems.map(r => (
            <Card
              key={r.m}
              style={{
                padding: "20px 16px 20px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: r.done ? "#f0fdf4" : "var(--surface)",
                border: r.current ? "2px solid var(--gold)" : r.milestone ? "1.5px solid var(--gold-rim)" : "1px solid var(--border)",
              }}
            >
              {(r.current || r.milestone) && (
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: r.current ? "var(--gold)" : "var(--gold-bg)",
                    color: r.current ? "white" : "#92400E",
                  }}
                >
                  {r.current ? "Current" : "Milestone"}
                </span>
              )}
              {r.done && !r.current && (
                <CheckCircle2 size={14} style={{ color: "var(--green)" }} />
              )}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: r.done ? "var(--green)" : "var(--ink-4)" }}>Month {r.m}</p>
                <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2, color: "var(--navy)" }}>{r.label}</p>
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1, color: r.milestone ? "var(--gold)" : r.done ? "var(--green)" : "var(--ink-5)" }}>
                {r.val}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Perks tab ────────────────────────────────────────────────────────────────
function PerksTab() {
  const [activated, setActivated] = useState<Record<string, boolean>>({});
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Partner Perks</p>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)" }}>16 brands · $800+ saved/year</h2>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 8, background: "var(--green-bg)", color: "var(--green)", flexShrink: 0 }}>
          Subscriber only
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {partnerData.map(p => (
          <Card key={p.name} style={{ display: "flex", flexDirection: "column", ...(p.featured ? { outline: "2px solid var(--gold)", outlineOffset: 0 } : {}) }}>
            {p.featured && (
              <div style={{ padding: "10px 20px", fontWeight: 600, fontSize: 11, background: "var(--gold-bg)", color: "#92400E", borderBottom: "1px solid var(--border)" }}>
                ★ Recommended for your protocol
              </div>
            )}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", flexShrink: 0, background: p.color, fontSize: 13 }}>
                  {p.name.slice(0, 2)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{p.name}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginTop: 2 }}>{p.cat}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, marginBottom: 20, background: "var(--subtle)" }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }}>{p.deal}</p>
                <p style={{ fontSize: 14, fontWeight: 800, marginLeft: 12, flexShrink: 0, color: "var(--green)" }}>{p.val}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActivated(a => ({ ...a, [p.name]: !a[p.name] }))}
                style={{
                  width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  marginTop: "auto",
                  background: activated[p.name] ? "var(--green-bg)" : "var(--navy)",
                  color: activated[p.name] ? "var(--green)" : "white",
                  border: activated[p.name] ? "1px solid var(--green-rim)" : "none",
                  cursor: "pointer",
                }}
              >
                {activated[p.name] ? "✓ Activated" : "Activate Perk"}
              </motion.button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Protocol tab ─────────────────────────────────────────────────────────────
function ProtocolTab() {
  const phases = [
    { name: "Phase 1 — Loading",     dur: "Days 1–60", dose: "4 softgels / day", detail: "2 with breakfast · 2 with dinner", active: true },
    { name: "Phase 2 — Maintenance", dur: "Day 61+",   dose: "2 softgels / day", detail: "Anytime with food. Long-term dose.", active: false },
  ];
  const timeline = [
    { period: "Day 1",     title: "Protocol begins",     desc: "Carvacrol & thymol start working on your gut microbiome.",    color: "#10b981" },
    { period: "Week 1",    title: "Early foundation",    desc: "Subtle digestive shifts as your gut responds.",               color: "#3b82f6" },
    { period: "Weeks 2–3", title: "First signals",       desc: "Reduced bloating and improved regularity.",                   color: "#8b5cf6", tag: "Most common" },
    { period: "Month 2",   title: "Building resilience", desc: "Energy improves as gut-driven inflammation decreases.",       color: "#f59e0b" },
    { period: "Month 3+",  title: "Protocol payoff",     desc: "Fewer illnesses, sustained comfort. You are here.",          color: "var(--green)", current: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {phases.map(ph => (
          <Card key={ph.name} style={ph.active ? { background: "var(--navy)", border: "none" } : {}}>
            <div style={{ padding: 28 }}>
              {ph.active && (
                <span style={{ display: "inline-block", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, marginBottom: 12, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                  Current phase
                </span>
              )}
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, color: ph.active ? "rgba(255,255,255,0.5)" : "var(--ink-3)" }}>
                {ph.name}
              </p>
              <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 8, color: ph.active ? "var(--gold)" : "var(--navy)", letterSpacing: "-0.02em" }}>
                {ph.dose}
              </p>
              <p style={{ fontSize: 14, marginBottom: 8, color: ph.active ? "rgba(255,255,255,0.5)" : "var(--ink-4)" }}>{ph.dur}</p>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: ph.active ? "rgba(255,255,255,0.6)" : "var(--ink-3)" }}>{ph.detail}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "var(--navy)" }}>Your 90-day journey</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: t.color, marginTop: 3, outline: t.current ? `3px solid ${t.color}30` : "none", outlineOffset: 2 }} />
                  {i < timeline.length - 1 && (
                    <div style={{ width: 1, flex: 1, marginTop: 6, marginBottom: 6, background: "var(--border)", minHeight: 28 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2, color: t.color }}>{t.period}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{t.title}</p>
                  <p style={{ fontSize: 14, marginTop: 4, lineHeight: 1.6, color: "var(--ink-3)" }}>{t.desc}</p>
                  {t.tag && (
                    <span style={{ display: "inline-block", marginTop: 6, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: "var(--subtle)", color: "var(--ink-4)" }}>
                      {t.tag}
                    </span>
                  )}
                  {t.current && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "var(--green-bg)", color: "var(--green)" }}>
                      ✓ You are here
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Check-in tab ─────────────────────────────────────────────────────────────
const checkInQuestions = [
  { id: "digestion",     label: "Digestion",     question: "How has your digestion been this week?",         icon: Activity,    color: "#2d6a4f", prev: 82, options: ["Very poor", "Poor", "Okay", "Good", "Excellent"] },
  { id: "energy",        label: "Energy",         question: "How would you rate your energy levels?",         icon: Zap,         color: "#4a8c6a", prev: 71, options: ["Exhausted", "Low", "Moderate", "Good", "Energised"] },
  { id: "immunity",      label: "Immunity",       question: "How strong does your immune system feel?",       icon: TrendingUp,  color: "#52796f", prev: 68, options: ["Very weak", "Weak", "Average", "Strong", "Very strong"] },
  { id: "inflammation",  label: "Inflammation",   question: "Any bloating or discomfort this week?",          icon: CheckCircle2,color: "#c4a256", prev: 76, options: ["Severe", "Noticeable", "Mild", "Minimal", "None at all"] },
  { id: "overall",       label: "Overall",        question: "Overall, how are you feeling on the protocol?",  icon: Star,        color: "var(--green)", prev: 74, options: ["No change", "Slight change", "Improving", "Much better", "Transformed"] },
];

function CheckInTab({ onBack }: { onBack: () => void }) {
  const [phase, setPhase]     = useState<"intro" | "quiz" | "results">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);

  const q = checkInQuestions[current];

  const handleAnswer = (val: number) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (current < checkInQuestions.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else {
      setPhase("results");
    }
  };

  const handleBack = () => {
    if (current > 0) { setDirection(-1); setCurrent(c => c - 1); }
    else setPhase("intro");
  };

  const newScores = checkInQuestions.map(q => {
    const ans = answers[q.id] ?? 3;
    return Math.max(40, Math.min(99, q.prev + (ans - 3) * 4));
  });
  const newResilienceScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);

  // ── Intro ──
  if (phase === "intro") return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 999, marginBottom: 14, background: "var(--green-bg)", border: "1px solid var(--green-rim)" }}>
            <HeartPulse size={12} style={{ color: "var(--green)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Weekly Check-in</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--navy)", lineHeight: 1.2, marginBottom: 8 }}>
            How are you feeling<br />this week?
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-4)", lineHeight: 1.6 }}>
            5 quick questions · Updates your Resilience Score · Earns +25 pts
          </p>
        </div>
        <div style={{ flexShrink: 0, padding: "14px 18px", borderRadius: 16, background: "var(--gold-bg)", border: "1px solid var(--gold-rim)", textAlign: "center" }}>
          <p style={{ fontSize: 26, lineHeight: 1 }}>🔥</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "var(--gold)", lineHeight: 1, marginTop: 6 }}>3</p>
          <p style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 3 }}>week streak</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 14, background: "var(--subtle)", border: "1px solid var(--border)" }}>
        <Calendar size={16} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>Last check-in: May 15, 2026</p>
          <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>Scores: Digestion 78 · Energy 68 · Immunity 64 · Inflam. 72</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {checkInQuestions.slice(0, 4).map(q => (
          <div key={q.id} style={{ padding: "14px 16px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${q.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <q.icon size={13} style={{ color: q.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)" }}>{q.label}</span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: q.color, lineHeight: 1 }}>{q.prev}</p>
            <p style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 3 }}>current score</p>
          </div>
        ))}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => { setPhase("quiz"); setCurrent(0); setAnswers({}); }}
        style={{ padding: "16px 0", borderRadius: 16, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", background: "var(--green)", color: "white", boxShadow: "0 4px 16px rgba(45,106,79,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        Start this week&apos;s check-in <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );

  // ── Quiz ──
  if (phase === "quiz") return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <button onClick={handleBack} style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-4)", background: "transparent", border: "none", cursor: "pointer" }}>← Back</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-4)" }}>{current + 1} / {checkInQuestions.length}</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${((current + 1) / checkInQuestions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, var(--green), ${q.color})` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.22 }}>
          <div style={{ borderRadius: 20, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", borderTop: `4px solid ${q.color}`, boxShadow: "var(--shadow-md)" }}>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${q.color}18` }}>
                  <q.icon size={16} style={{ color: q.color }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)" }}>{q.label}</span>
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", lineHeight: 1.35, marginBottom: 28 }}>{q.question}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => {
                  const val = i + 1;
                  const selected = answers[q.id] === val;
                  return (
                    <motion.button key={opt} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(val)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, textAlign: "left", cursor: "pointer", background: selected ? `${q.color}12` : "var(--subtle)", border: selected ? `2px solid ${q.color}` : "1.5px solid transparent" }}>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700, background: selected ? q.color : "var(--border)", color: selected ? "white" : "var(--ink-4)" }}>
                        {val}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: selected ? 600 : 400, color: selected ? "var(--navy)" : "var(--ink-2)" }}>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // ── Results ──
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>

      <div style={{ padding: "28px 28px 24px", borderRadius: 20, background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 100%)", textAlign: "center" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
          style={{ fontSize: 48, marginBottom: 12 }}>🎉
        </motion.div>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Check-in complete</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 12 }}>Resilience Score updated</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--gold)" }}>74 → {newResilienceScore}</span>
          <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>+25 pts earned 🌟</span>
        </div>
      </div>

      <div>
        <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 12 }}>Metric updates</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {checkInQuestions.slice(0, 4).map((q, i) => {
            const next = newScores[i];
            const diff = next - q.prev;
            return (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${q.color}15` }}>
                  <q.icon size={15} style={{ color: q.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{q.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--ink-4)" }}>{q.prev}</span>
                      <span style={{ fontSize: 11, color: "var(--ink-5)" }}>→</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: q.color }}>{next}</span>
                      {diff !== 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: diff > 0 ? "var(--green-bg)" : "var(--red-bg)", color: diff > 0 ? "var(--green)" : "var(--red)" }}>
                          {diff > 0 ? "+" : ""}{diff}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: `${q.prev}%` }}
                      animate={{ width: `${next}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 999, background: q.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setPhase("intro"); setCurrent(0); setAnswers({}); }}
          style={{ flex: 1, padding: "13px 0", borderRadius: 14, fontSize: 14, fontWeight: 600, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--ink-3)", cursor: "pointer" }}>
          Retake
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onBack}
          style={{ flex: 2, padding: "13px 0", borderRadius: 14, fontSize: 14, fontWeight: 700, border: "none", background: "var(--green)", color: "white", cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,79,.3)" }}>
          Back to dashboard
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Sidebar nav types + items ────────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: React.ElementType; href?: string };
type NavSection = { heading: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    heading: "Membership",
    items: [
      { id: "overview",  label: "Overview",    icon: LayoutDashboard },
      { id: "checkin",   label: "Check-in",    icon: HeartPulse },
      { id: "rewards",   label: "Rewards",     icon: Medal },
      { id: "perks",     label: "Perks",       icon: Handshake },
      { id: "protocol",  label: "Protocol",    icon: ListChecks },
    ],
  },
  {
    heading: "Learn",
    items: [
      { id: "lessons",   label: "Lessons",     icon: GraduationCap },
      { id: "kitchen",   label: "Kitchen",     icon: UtensilsCrossed },
      { id: "library",   label: "Library",     icon: BookOpen },
    ],
  },
  {
    heading: "Account",
    items: [
      { id: "manage", label: "Manage Plan", icon: Settings2, href: "/cancel" },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      {/* ── Body: sidebar + main ── */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 54px)" }}>

        {/* ── Sidebar — desktop only ── */}
        <aside
          className="sidebar"
          style={{
            width: 256,
            background: "var(--surface)",
            borderRight: "1px solid var(--border)",
            position: "sticky",
            top: 54,
            height: "calc(100vh - 54px)",
            overflowY: "auto",
          }}
        >
          <div style={{ flex: 1 }}>
            {NAV_SECTIONS.map((section, si) => (
              <div key={section.heading}>
                {/* Section header row */}
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 20px",
                    background: "var(--subtle)",
                    borderTop: si > 0 ? "1px solid var(--border)" : "none",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)" }}
                  >
                    {section.heading}
                  </span>
                  <ChevronRight size={13} style={{ color: "var(--ink-5)" }} />
                </div>

                {/* Nav items */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {section.items.map(item => {
                    const active = tab === item.id && !item.href;
                    const content = (
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          cursor: "pointer",
                          padding: "14px 20px",
                          background: active ? "var(--green-bg)" : "transparent",
                          borderLeft: `3px solid ${active ? "var(--green)" : "transparent"}`,
                          transition: "background 0.15s ease",
                        }}
                      >
                        <item.icon
                          size={17}
                          style={{ color: active ? "var(--green)" : "var(--ink-3)", flexShrink: 0 }}
                        />
                        <span
                          style={{ flex: 1, fontSize: 15, fontWeight: active ? 600 : 400, color: active ? "var(--green)" : "var(--ink-2)", letterSpacing: "-0.01em" }}
                        >
                          {item.label}
                        </span>
                        {active && (
                          <ChevronRight size={15} style={{ color: "var(--green)", flexShrink: 0 }} />
                        )}
                      </div>
                    );
                    if (item.href) {
                      return <Link key={item.id} href={item.href}>{content}</Link>;
                    }
                    return (
                      <div key={item.id} onClick={() => setTab(item.id)}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, color: "var(--ink-5)" }}>Customer Subscription Portal · Powered by Loop</p>
            <p style={{ fontSize: 12, marginTop: 2, color: "var(--ink-5)" }}>© 2026 Resilia Inc.</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          {/* Page header */}
          <div style={{ position: "relative", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", background: "linear-gradient(135deg, var(--navy) 0%, #1a4535 50%, #224d3a 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {/* Decorative background shapes */}
            <div style={{ position: "absolute", top: -48, right: 120, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, right: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(196,162,86,0.07)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -20, right: 280, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, marginBottom: 10, background: "rgba(196,162,86,0.15)", border: "1px solid rgba(196,162,86,0.25)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Member Portal</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 10, color: "white", letterSpacing: "-0.02em" }}>
                {TABS.find(t => t.id === tab)?.label ?? "Overview"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                  Jessica M. · Active subscriber · Member since March 2026
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(74,222,128,0.9)" }}>Active</span>
                </div>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <Link href="/cancel" style={{ textDecoration: "none" }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>
                  <Settings2 size={13} /> Manage Plan
                </button>
              </Link>
            </div>
          </div>

          {/* Subscription progress strip */}
          <div style={{ padding: "10px 40px", background: "var(--navy)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>Month 3 of 12</span>
            <div style={{ flex: 1, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "25%" }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--green), var(--gold))" }}
              />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", whiteSpace: "nowrap" }}>$470+ rewards ahead</span>
          </div>

          {/* Tab content */}
          <div style={{ padding: "40px 40px 112px 40px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                {tab === "overview"  && <OverviewTab />}
                {tab === "checkin"   && <CheckInTab onBack={() => setTab("overview")} />}
                {tab === "lessons"   && <LessonsTab />}
                {tab === "kitchen"   && <KitchenTab />}
                {tab === "library"   && <LibraryTab />}
                {tab === "rewards"   && <RewardsTab />}
                {tab === "perks"     && <PerksTab />}
                {tab === "protocol"  && <ProtocolTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
