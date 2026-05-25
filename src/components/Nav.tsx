"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings2, LogOut, Sparkles } from "lucide-react";

const links = [
  { label: "Subscriptions", href: "/dashboard", icon: LayoutDashboard },
  { label: "Manage Plan",   href: "/cancel",     icon: Settings2 },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(90deg, var(--navy) 0%, #1f4a38 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ width: "100%", padding: "0 20px", display: "flex", alignItems: "center", gap: 8 }}>

          {/* Logo */}
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, marginRight: 8, textDecoration: "none" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, var(--green) 0%, #3d8a62 100%)",
              boxShadow: "0 2px 8px rgba(45,106,79,0.4)",
            }}>
              <Sparkles size={14} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: "white", fontSize: 15, letterSpacing: "-0.02em" }}>
              Customer Subscription Portal
            </span>
          </Link>

          {/* Separator — desktop only */}
          <div className="nav-sep" style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)", flexShrink: 0, margin: "0 8px" }} />

          {/* Desktop nav links */}
          <nav className="nav-links">
            {links.map((l) => {
              const active = pathname?.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 14px", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    color:      active ? "white" : "rgba(255,255,255,0.45)",
                    background: active ? "rgba(255,255,255,0.11)" : "transparent",
                    border:     active ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <l.icon size={14} />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>

            {/* Points badge — sm+ */}
            <div className="nav-pts" style={{ gap: 5, padding: "5px 10px", borderRadius: 999, background: "rgba(196,162,86,0.15)", border: "1px solid rgba(196,162,86,0.3)" }}>
              <span style={{ fontSize: 11, color: "var(--gold)" }}>★</span>
              <span style={{ fontWeight: 700, fontSize: 12, color: "var(--gold)" }}>280 pts</span>
            </div>

            {/* User pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 10,
                background: "linear-gradient(135deg, var(--green) 0%, #3d8a62 100%)",
                color: "white", flexShrink: 0,
              }}>
                JM
              </div>
              <span className="nav-email" style={{ fontWeight: 500, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                user@resilia.shop
              </span>
            </div>

            {/* Sign out — desktop only */}
            <Link href="/" className="nav-signout" style={{ gap: 6, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
              <LogOut size={13} />
              <span>Sign out</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="nav-mobile-bar"
        style={{
          height: 60,
          background: "var(--navy)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {links.map((l) => {
          const active = pathname?.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: active ? "white" : "rgba(255,255,255,0.35)", textDecoration: "none" }}
            >
              <l.icon size={19} />
              <span style={{ fontWeight: 500, fontSize: 10 }}>{l.label}</span>
            </Link>
          );
        })}
        <Link
          href="/"
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
        >
          <LogOut size={19} />
          <span style={{ fontWeight: 500, fontSize: 10 }}>Sign out</span>
        </Link>
      </nav>
    </>
  );
}
