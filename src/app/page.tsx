"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, CheckCircle, Sparkles, Star, Shield, Gift, TrendingUp } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: TrendingUp, title: "Resilience Score™",  desc: "Track gut health month by month",    color: "#22C55E" },
  { icon: Gift,        title: "Rewards roadmap",    desc: "$470+ in gifts over 12 months",      color: "#F59E0B" },
  { icon: Shield,      title: "Partner perks",      desc: "16 brands · $800+/yr in savings",    color: "#818CF8" },
];

export default function AuthPage() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: 900, display: "flex", borderRadius: 24, overflow: "hidden",
          background: "var(--surface)",
          boxShadow: "0 20px 60px -10px rgba(0,0,0,.12), 0 0 0 1px var(--border)",
        }}
      >
        {/* ── Left panel ── */}
        <div
          className="hidden md:flex"
          style={{
            flexDirection: "column", justifyContent: "space-between",
            width: 420, flexShrink: 0, padding: 40,
            position: "relative", overflow: "hidden",
            background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-2) 50%, var(--green) 100%)",
          }}
        >
          {/* Decorative shapes */}
          <div style={{ position: "absolute", top: -64, right: -64, width: 256, height: 256, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: 80, left: -40, width: 192, height: 192, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 128, height: 128, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span className="serif" style={{ fontWeight: 500, color: "white", fontSize: 16, letterSpacing: "0.12em" }}>
              RESILIA<sup style={{ fontSize: 9 }}>®</sup>
            </span>
          </div>

          {/* Main copy */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, marginBottom: 20, background: "var(--gold-bg)", color: "#8a7030", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em" }}>
              <Star size={10} fill="currentColor" /> Trusted by 12,000+ subscribers
            </div>
            <h1 className="serif" style={{ fontWeight: 500, color: "white", lineHeight: 1, marginBottom: 16, fontSize: 38, letterSpacing: "-0.01em" }}>
              Keep more.<br />Cancel less.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 32, color: "rgba(255,255,255,0.6)" }}>
              The subscriber portal that makes staying feel like the obvious choice.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(255,255,255,0.15)" }}>
                    <Icon size={16} color="white" />
                  </div>
                  <div>
                    <p style={{ color: "white", fontWeight: 600, fontSize: 14, lineHeight: 1, marginBottom: 4 }}>{title}</p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[["12K+", "Members"], ["4.9★", "Rating"], ["$470+", "Rewards"]].map(([n, l]) => (
              <div key={l}>
                <p style={{ color: "white", fontWeight: 700, fontSize: 20, lineHeight: 1, marginBottom: 4 }}>{n}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px" }}>

          {/* Mobile logo */}
          <div className="md:hidden" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--green)" }}>
              <Sparkles size={15} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Customer Subscription Portal</span>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, color: "var(--green)" }}>
                  Subscriber Portal
                </p>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                  Welcome back
                </h2>
                <p style={{ fontSize: 14, marginBottom: 32, color: "var(--ink-3)" }}>
                  Enter your email — we&#39;ll send a secure magic link. No password needed.
                </p>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="email" style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)" }}>
                    Email address
                  </label>
                  <div style={{ position: "relative", marginBottom: 16 }}>
                    <Mail size={15} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--ink-4)" }} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={{
                        width: "100%", fontSize: 14, borderRadius: 12,
                        paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
                        background: "var(--subtle)", border: "1.5px solid transparent",
                        color: "var(--ink)", outline: "none", boxSizing: "border-box",
                      }}
                      onFocus={e => {
                        e.target.style.background = "var(--surface)";
                        e.target.style.borderColor = "var(--green)";
                        e.target.style.boxShadow = "0 0 0 3px var(--green-bg)";
                      }}
                      onBlur={e => {
                        e.target.style.background = "var(--subtle)";
                        e.target.style.borderColor = "transparent";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !email}
                    whileHover={email ? { scale: 1.01 } : {}}
                    whileTap={email ? { scale: 0.98 } : {}}
                    style={{
                      width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      marginBottom: 20, border: "none",
                      background: email ? "var(--green)" : "var(--subtle)",
                      color: email ? "white" : "var(--ink-4)",
                      cursor: email ? "pointer" : "default",
                      boxShadow: email ? "0 4px 16px rgba(22,163,74,.3)" : "none",
                    }}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white" }}
                      />
                    ) : (
                      <><span>Send magic link</span><ArrowRight size={14} /></>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-4)" }}>or skip to demo</span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>

                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                      background: "var(--green-bg)", color: "var(--green)", border: "1.5px solid var(--green-rim)",
                    }}
                  >
                    <Sparkles size={14} /> Open demo dashboard
                  </motion.div>
                </Link>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "8px 16px", marginTop: 20 }}>
                  {[["🔒", "Encrypted"], ["⚡", "Instant"], ["🛡️", "No spam"]].map(([icon, text]) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12 }}>{icon}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: "center" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.05 }}
                  style={{ width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", background: "var(--green-bg)" }}
                >
                  <CheckCircle size={36} style={{ color: "var(--green)" }} />
                </motion.div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>
                  Check your inbox
                </h2>
                <p style={{ fontSize: 14, marginBottom: 32, color: "var(--ink-3)" }}>
                  Magic link sent to <strong style={{ color: "var(--ink)" }}>{email}</strong>
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setSent(false)}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 500, border: "1.5px solid var(--border)", background: "var(--subtle)", color: "var(--ink-3)", cursor: "pointer" }}
                  >
                    Wrong email
                  </button>
                  <Link href="/dashboard" style={{ flex: 1 }}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      style={{ width: "100%", padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", color: "white", background: "var(--green)" }}
                    >
                      Go to demo <ArrowRight size={13} />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
