"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "?" },
  { href: "/dashboard/upload", label: "Upload", icon: "?" },
  { href: "/dashboard/graph", label: "Knowledge Graph", icon: "?" },
  { href: "/dashboard/quiz", label: "Quiz Center", icon: "??" },
  { href: "/dashboard/revision", label: "Revision Queue", icon: "?" },
  { href: "/dashboard/concepts", label: "All Concepts", icon: "=" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "??" },
  { href: "/dashboard/search", label: "Search", icon: "??" },
  { href: "/dashboard/settings", label: "Settings", icon: "?" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    else api.get("/auth/me").then(r => { setUser(r.data.user); localStorage.setItem("user", JSON.stringify(r.data.user)); }).catch(() => window.location.href = "/login");
  }, []);

  const logout = async () => { await api.post("/auth/logout").catch(() => {}); localStorage.clear(); window.location.href = "/login"; };
  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  const pageTitle = NAV.find(n => n.href === path)?.label || "Dashboard";

  const Sidebar = () => (
    <aside style={{ width: 230, background: "#111318", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 800 }}>Recall<span style={{ background: "linear-gradient(135deg,#6C63FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IQ</span></div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV.map(({ href, label, icon }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: path === href ? "#A78BFA" : "#94A3B8", background: path === href ? "rgba(108,99,255,0.15)" : "transparent", borderLeft: path === href ? "2px solid #6C63FF" : "2px solid transparent", marginBottom: 2, textDecoration: "none" }}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "#94A3B8", background: "transparent", border: "none", cursor: "pointer", width: "100%", marginTop: 8, fontFamily: "DM Sans,sans-serif" }}>?? Logout</button>
      </nav>
      <div style={{ padding: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, background: "#1A1C24" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#22D3EE)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13 }}>{initial}</div>
          <div><div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name || "User"}</div><div style={{ fontSize: 11, color: "#475569" }}>Free Plan</div></div>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0B0F" }}>
      <div style={{ display: "none" }} className="lg:block"><Sidebar /></div>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "relative", zIndex: 1 }}><Sidebar /></div>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ height: 56, background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: "#F1F5F9", fontSize: 22, cursor: "pointer" }}>?</button>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 600 }}>{pageTitle}</span>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#22D3EE)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }} onClick={() => window.location.href = "/dashboard/settings"}>{initial}</div>
        </header>
        <main style={{ flex: 1, padding: 24, maxWidth: 1200, width: "100%", margin: "0 auto" }}>{children}</main>
      </div>
    </div>
  );
}
