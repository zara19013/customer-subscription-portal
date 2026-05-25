"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import {
  ArrowLeft, ArrowRight, CheckCircle2, X,
  Pause, Tag, Package, MessageCircle,
  Gift, Shield, Clock, TrendingUp, Zap,
  ChevronRight, Heart, Sparkles,
} from "lucide-react";

type Step = "reason" | "offer" | "confirm" | "saved" | "cancelled";

const reasons = [
  { id: "price",   label: "It's too expensive",              sub: "The cost doesn't fit my budget right now",    icon: Tag,           color: "#D97706", bg: "#FFFBEB" },
  { id: "results", label: "I'm not seeing results",          sub: "Haven't noticed changes in how I feel",       icon: TrendingUp,    color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "pause",   label: "I need a break / too much stock", sub: "Have leftover supply, need to slow down",     icon: Pause,         color: "#0EA5E9", bg: "#E0F2FE" },
  { id: "switch",  label: "Switching to another product",    sub: "Found something else I want to try",          icon: Package,       color: "#EC4899", bg: "#FDF2F8" },
  { id: "timing",  label: "I forgot to cancel earlier",      sub: "Meant to cancel before this billing cycle",   icon: Clock,         color: "#F97316", bg: "#FFF7ED" },
  { id: "other",   label: "Something else",                  sub: "I have a different reason",                   icon: MessageCircle, color: "#64748B", bg: "#F8FAFC" },
];

const offers: Record<string, Array<{
  tag: string; headline: string; body: string; badge: string; cta: string; featured?: boolean;
}>> = {
  price: [
    { tag: "Exclusive offer",     headline: "Stay at $49.99/mo for 3 months",     body: "Lock in 38% off your current rate. No commitment after 3 months — cancel anytime.",                       badge: "Save $90",      cta: "Accept this offer",    featured: true },
    { tag: "Flexible option",     headline: "Pause for up to 2 months",           body: "No charges while paused. Your reward streak, Month 6 lab panel, and partner perks are fully preserved.",  badge: "Save $160",     cta: "Pause my subscription" },
  ],
  results: [
    { tag: "Free support",        headline: "Review your protocol with our team", body: "Most subscribers see real results at months 4–6. Book a free 15-min call with our wellness team.",        badge: "Free call",     cta: "Book consultation",    featured: true },
    { tag: "Try one more month",  headline: "One month at $49.99, risk-free",     body: "Give the protocol more time at a lower cost. Full refund if you still don't see results at month 4.",     badge: "Save $30",      cta: "Try at $49.99" },
  ],
  pause: [
    { tag: "Used by 43% of members", headline: "Pause for 1 month",              body: "Skip your next order. Zero charge, zero penalty. Auto-resumes when you're ready.",                        badge: "Save $79.99",   cta: "Pause 1 month",        featured: true },
    { tag: "More flexibility",    headline: "Pause for 2 months",                 body: "Two full billing cycles off. Rewards, score history, and partner perks stay completely intact.",           badge: "Save $160",     cta: "Pause 2 months" },
  ],
  switch: [
    { tag: "Early access",        headline: "Try our next formula — free",        body: "Get a free 2-week sample of our new botanical stack shipped with your next order. No strings attached.",   badge: "$30+ value",    cta: "Get free sample",      featured: true },
    { tag: "Stack & save",        headline: "$49.99/mo for 3 months",             body: "Resilia® stacks well with most supplements. Stay on protocol at a significantly lower rate.",             badge: "Save $90",      cta: "Accept reduced rate" },
  ],
  timing: [
    { tag: "No questions asked",  headline: "Refund this billing cycle",          body: "We'll refund your most recent charge in full and keep your account active. Your rewards stay intact.",    badge: "$79.99 back",   cta: "Request refund",       featured: true },
    { tag: "Keep your streak",    headline: "Pause 1 month instead",              body: "No charge next cycle. Your reward streak and Month 6 lab panel are fully preserved.",                    badge: "Save $79.99",   cta: "Pause 1 month" },
  ],
  other: [
    { tag: "We're here",          headline: "Talk to our support team",           body: "Whatever's going on, we want to make it right. Our team responds within 4 hours, any request.",           badge: "Free",          cta: "Chat with support",    featured: true },
    { tag: "No pressure",         headline: "Pause for 1 month",                  body: "No charges. No expiry. Come back whenever you're ready — your benefits and rewards stay intact.",         badge: "Save $79.99",   cta: "Pause subscription" },
  ],
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  const steps = ["Why", "Options", "Confirm"];
  return (
    <div className="flex items-center gap-2 shrink-0">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all"
            style={{
              background: i < current ? "var(--green)" : i === current ? "var(--green)" : "var(--subtle)",
              color: i <= current ? "white" : "var(--ink-4)",
            }}
          >
            {i < current ? <CheckCircle2 size={13} /> : i + 1}
          </div>
          <span
            className="text-xs font-semibold hidden sm:block"
            style={{ color: i === current ? "var(--ink)" : "var(--ink-4)" }}
          >
            {s}
          </span>
          {i < steps.length - 1 && (
            <div
              className="w-5 sm:w-8 h-0.5 rounded-full"
              style={{ background: i < current ? "var(--green)" : "var(--border)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── What you'd lose widget ───────────────────────────────────────────────────
function LossWidget() {
  const items = [
    { icon: Gift,       label: "Month 4–8 gifts",           val: "$75+",     color: "#16A34A" },
    { icon: Zap,        label: "Free lab panel (Month 6)",  val: "$120",     color: "#D97706" },
    { icon: Sparkles,   label: "Partner perks · 16 brands", val: "$800+/yr", color: "#8B5CF6" },
    { icon: TrendingUp, label: "Resilience Score progress", val: "74 pts",   color: "#0EA5E9" },
  ];

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", marginTop: 20, border: "1.5px solid var(--gold-rim)" }}>
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, background: "var(--gold-bg)", borderBottom: "1px solid var(--gold-rim)" }}>
        <Gift size={14} style={{ color: "var(--gold)" }} />
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>
          What you'd give up by cancelling today
        </p>
      </div>

      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "var(--surface)" }}>
        {items.map(item => (
          <div key={item.label} style={{ borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, background: "var(--subtle)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${item.color}18` }}>
              <item.icon size={14} style={{ color: item.color }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--ink-2)" }}>
                {item.label}
              </p>
              <p style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--navy)" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Total value at stake</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: "white" }}>$412+</p>
      </div>
    </div>
  );
}

// ─── Reason step ──────────────────────────────────────────────────────────────
function ReasonStep({ selected, setSelected, onNext }: {
  selected: string | null;
  setSelected: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      key="reason"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <h1 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, marginBottom: 4, color: "var(--ink)" }}>
        What&apos;s going on?
      </h1>
      <p style={{ fontSize: 14, marginBottom: 20, color: "var(--ink-3)" }}>
        Your honest answer helps us find a better option for you.
      </p>

      <div className="flex flex-col gap-2.5">
        {reasons.map(r => {
          const active = selected === r.id;
          return (
            <motion.button
              key={r.id}
              whileHover={{ x: active ? 0 : 3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(r.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 16,
                padding: "14px 16px", borderRadius: 16, textAlign: "left",
                background: active ? r.bg : "var(--surface)",
                border: active ? `2px solid ${r.color}` : "1.5px solid var(--border)",
                boxShadow: active ? `0 0 0 3px ${r.color}18` : "0 1px 3px rgba(0,0,0,.05)",
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: active ? `${r.color}22` : "var(--subtle)", color: active ? r.color : "var(--ink-3)" }}>
                <r.icon size={17} />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{r.label}</p>
                <p style={{ fontSize: 12, marginTop: 2, color: "var(--ink-3)" }}>{r.sub}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `2px solid ${active ? r.color : "var(--border)"}`, background: active ? r.color : "transparent" }}>
                {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
              </div>
            </motion.button>
          );
        })}
      </div>

      <LossWidget />

      <motion.button
        whileHover={selected ? { scale: 1.01 } : {}}
        whileTap={selected ? { scale: 0.97 } : {}}
        onClick={() => selected && onNext()}
        style={{
          width: "100%", marginTop: 20, padding: "16px 0", borderRadius: 16, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: selected ? "var(--green)" : "var(--subtle)",
          color: selected ? "white" : "var(--ink-4)",
          cursor: selected ? "pointer" : "default",
          boxShadow: selected ? "0 4px 16px rgba(22,163,74,.3)" : "none",
          fontSize: 15, border: "none",
        }}
      >
        {selected
          ? <><span>See my personalised options</span><ArrowRight size={16} /></>
          : "Select a reason above to continue"
        }
      </motion.button>
    </motion.div>
  );
}

// ─── Offer step ───────────────────────────────────────────────────────────────
function OfferStep({ reason, onAccept, onSkip }: {
  reason: string; onAccept: () => void; onSkip: () => void;
}) {
  const list = offers[reason] ?? offers["other"];
  return (
    <motion.div
      key="offer"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <span
        style={{ display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 14px", borderRadius: 999, marginBottom: 16, background: "var(--gold-bg)", color: "var(--green)", border: "1px solid var(--gold-rim)" }}
      >
        Personalised for you
      </span>
      <h1 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, marginBottom: 4, color: "var(--ink)" }}>
        Wait — we have a better idea.
      </h1>
      <p style={{ fontSize: 14, marginBottom: 24, color: "var(--ink-3)" }}>
        2,847 members in the same situation chose one of these last month.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
        {list.map((o, i) => (
          <motion.div
            key={o.cta}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              borderRadius: 16, overflow: "hidden",
              background: "var(--surface)",
              border: o.featured ? "2px solid var(--green)" : "1.5px solid var(--border)",
              boxShadow: o.featured ? "0 4px 20px rgba(22,163,74,.12)" : "0 1px 4px rgba(0,0,0,.05)",
            }}
          >
            <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: o.featured ? "var(--gold-bg)" : "var(--subtle)", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: o.featured ? "var(--green)" : "var(--ink-3)" }}>{o.tag}</p>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999, background: o.featured ? "var(--green)" : "var(--border)", color: o.featured ? "white" : "var(--ink-2)" }}>
                {o.badge}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>{o.headline}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, color: "var(--ink-3)" }}>{o.body}</p>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={onAccept}
                style={{ width: "100%", padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", cursor: "pointer", background: o.featured ? "var(--green)" : "var(--navy)", color: "white", boxShadow: o.featured ? "0 4px 14px rgba(22,163,74,.3)" : "none" }}
              >
                {o.cta} <ChevronRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social proof */}
      <div style={{ borderRadius: 16, padding: 16, marginBottom: 20, background: "var(--subtle)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ display: "flex" }}>
            {["var(--green)", "#8B5CF6", "var(--gold)"].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid white", marginLeft: i > 0 ? -6 : 0, background: c }} />
            ))}
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-3)" }}>
            <strong style={{ color: "var(--ink)" }}>2,847 members</strong> stayed last month
          </p>
        </div>
        <p style={{ fontSize: 14, fontStyle: "italic", lineHeight: 1.6, color: "var(--ink-3)" }}>
          &quot;I was about to cancel over cost. The discount they offered was perfect — I&apos;m now at month 7 and just got my free herb garden.&quot;
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, marginTop: 8, color: "var(--green)" }}>— Maria T., Month 7</p>
      </div>

      <button
        onClick={onSkip}
        style={{ width: "100%", padding: "14px 0", borderRadius: 16, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--ink-4)", border: "1.5px solid var(--border)", background: "transparent", cursor: "pointer" }}
      >
        <X size={13} /> No thanks — continue to cancel
      </button>
    </motion.div>
  );
}

// ─── Confirm step ─────────────────────────────────────────────────────────────
function ConfirmStep({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <h1 style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 800, marginBottom: 4, color: "var(--ink)" }}>
        Are you absolutely sure?
      </h1>
      <p style={{ fontSize: 14, marginBottom: 20, color: "var(--ink-3)" }}>
        Cancelling ends your subscription after Jun 15, 2026.
      </p>

      {/* Loss list */}
      <div style={{ borderRadius: 16, padding: 20, marginBottom: 16, background: "var(--surface)", border: "2px solid var(--red-rim)" }}>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: "var(--red)" }}>
          You will permanently lose
        </p>
        {[
          ["Month 4–12 rewards & gifts",   "$412+"],
          ["Free Month 6 lab panel",        "$120 value"],
          ["Partner perks — 16 brands",     "$800+/yr saved"],
          ["Resilience Score history",      "74 pts built"],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <X size={13} style={{ color: "var(--red)", flexShrink: 0 }} />
              <p style={{ fontSize: 14, color: "var(--ink)" }}>{l}</p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, marginLeft: 16, flexShrink: 0, color: "var(--ink-3)" }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Billing note */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, marginBottom: 16, background: "var(--gold-bg)", border: "1px solid var(--gold-rim)" }}>
        <Shield size={14} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
          Your subscription stays active until <strong>June 15, 2026</strong>. No further charges after confirmation.
        </p>
      </div>

      {/* Confirmation checkbox */}
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px", borderRadius: 12, marginBottom: 20, cursor: "pointer", background: agreed ? "var(--red-bg)" : "var(--surface)", border: agreed ? "1.5px solid var(--red-rim)" : "1.5px solid var(--border)" }}
        onClick={() => setAgreed(!agreed)}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all"
          style={{
            background: agreed ? "var(--red)" : "transparent",
            border: agreed ? "none" : "1.5px solid var(--ink-5)",
          }}
        >
          {agreed && <CheckCircle2 size={11} color="white" />}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-3)" }}>
          I understand I&apos;ll permanently lose my rewards, lab panel, and partner perks. I want to cancel anyway.
        </p>
      </div>

      <motion.button
        whileHover={agreed ? { scale: 1.01 } : {}}
        whileTap={agreed ? { scale: 0.97 } : {}}
        onClick={() => agreed && onConfirm()}
        style={{ width: "100%", padding: "14px 0", borderRadius: 16, fontWeight: 700, marginBottom: 12, fontSize: 15, border: "none", background: agreed ? "var(--red)" : "var(--subtle)", color: agreed ? "white" : "var(--ink-4)", cursor: agreed ? "pointer" : "default" }}
      >
        Yes, cancel my subscription
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBack}
        style={{ width: "100%", padding: "14px 0", borderRadius: 16, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "white", background: "var(--green)", boxShadow: "0 4px 14px rgba(22,163,74,.3)" }}
      >
        <ArrowLeft size={15} /> Keep my benefits instead
      </motion.button>
    </motion.div>
  );
}

// ─── Saved step ───────────────────────────────────────────────────────────────
function SavedStep() {
  return (
    <motion.div
      key="saved"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      style={{ textAlign: "center", paddingTop: 40, paddingBottom: 40 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.05 }}
        style={{ width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", background: "var(--gold-bg)" }}
      >
        <Heart size={32} style={{ color: "var(--green)" }} />
      </motion.div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--ink)" }}>
        You&apos;re staying — great choice!
      </h1>
      <p style={{ fontSize: 14, marginBottom: 32, color: "var(--ink-3)", maxWidth: 340, margin: "0 auto 32px" }}>
        Your offer has been applied. Here&apos;s your updated plan.
      </p>

      <div style={{ borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left", background: "var(--surface)", border: "1.5px solid var(--border)" }}>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: "var(--green)" }}>
          Updated plan
        </p>
        {[
          { l: "New monthly rate", v: "$49.99 / month", accent: true },
          { l: "You're saving",    v: "$30/mo for 3 months" },
          { l: "Next billing",     v: "June 15, 2026" },
          { l: "Rewards streak",   v: "Month 3 — intact ✓" },
        ].map(row => (
          <div key={row.l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{row.l}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: row.accent ? "var(--green)" : "var(--ink)" }}>{row.v}</p>
          </div>
        ))}
      </div>

      <Link href="/dashboard">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          style={{ width: "100%", padding: "16px 0", borderRadius: 16, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "white", background: "var(--green)", boxShadow: "0 4px 14px rgba(22,163,74,.3)" }}
        >
          Back to my dashboard <ArrowRight size={15} />
        </motion.button>
      </Link>
    </motion.div>
  );
}

// ─── Cancelled step ───────────────────────────────────────────────────────────
function CancelledStep() {
  return (
    <motion.div
      key="cancelled"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ textAlign: "center", paddingTop: 40, paddingBottom: 40 }}
    >
      <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", background: "var(--subtle)" }}>
        <X size={24} style={{ color: "var(--ink-3)" }} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--ink)" }}>
        Subscription cancelled
      </h1>
      <p style={{ fontSize: 14, marginBottom: 32, color: "var(--ink-3)", maxWidth: 340, margin: "0 auto 32px" }}>
        Sorry to see you go. Your access continues until June 15, 2026.
      </p>

      <div style={{ borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left", background: "var(--subtle)", border: "1px solid var(--border)" }}>
        {[
          "Access continues until June 15, 2026",
          "No further charges will be made",
          "Confirmation email is on its way",
          "Resubscribe anytime to restart your rewards",
        ].map((t, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: "var(--ink-4)" }} />
            <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.01 }}
            style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer" }}
          >
            Dashboard
          </motion.button>
        </Link>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: "var(--green)", color: "white" }}
          >
            Resubscribe →
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CancelPage() {
  const [step, setStep]     = useState<Step>("reason");
  const [reason, setReason] = useState<string | null>(null);

  const stepMap: Partial<Record<Step, number>> = { reason: 0, offer: 1, confirm: 2 };
  const stepIdx = stepMap[step] ?? -1;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      {/* Progress bar */}
      {stepIdx >= 0 && (
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            {step === "reason" ? (
              <Link
                href="/dashboard"
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--ink-3)" }}
              >
                <ArrowLeft size={14} /> Dashboard
              </Link>
            ) : (
              <button
                onClick={() => setStep(step === "confirm" ? "offer" : "reason")}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--ink-3)", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <StepBar current={stepIdx} />
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 32px 80px 32px" }}>
        <AnimatePresence mode="wait">
          {step === "reason" && (
            <ReasonStep
              key="reason"
              selected={reason}
              setSelected={setReason}
              onNext={() => setStep("offer")}
            />
          )}
          {step === "offer" && reason && (
            <OfferStep
              key="offer"
              reason={reason}
              onAccept={() => setStep("saved")}
              onSkip={() => setStep("confirm")}
            />
          )}
          {step === "confirm" && (
            <ConfirmStep
              key="confirm"
              onConfirm={() => setStep("cancelled")}
              onBack={() => setStep("offer")}
            />
          )}
          {step === "saved"     && <SavedStep     key="saved"     />}
          {step === "cancelled" && <CancelledStep key="cancelled" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
