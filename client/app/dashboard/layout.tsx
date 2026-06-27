"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/upload", label: "Upload" },
  { href: "/dashboard/graph", label: "Knowledge Graph" },
  { href: "/dashboard/quiz", label: "Quiz Center" },
  { href: "/dashboard/revision", label: "Revision Queue" },
  { href: "/dashboard/concepts", label: "All Concepts" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/search", label: "Search" },
  { href: "/dashboard/settings", label: "Settings" },
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

  const SidebarContent = () => (
    <aside style={{ width: 240, background: "#FFFFFF", borderRight: "1px solid #EDEDED", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "28px 24px 16px" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 800, color: "#0A0A0A", letterSpacing: -0.5 }}>RecallIQ</div>
      </div>
      <nav style={{ flex: 1, padding: "8px 14px", overflowY: "auto" }}>
        {NAV.map(({ href, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              display: "block", padding: "11px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: active ? 700 : 500,
              color: active ? "#FFFFFF" : "#6B6B6B", background: active ? "#0A0A0A" : "transparent",
              marginBottom: 3, textDecoration: "none", transition: "all .15s"
            }}>
              {label}
            </Link>
          );
        })}
        <button onClick={logout} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: "#6B6B6B", background: "transparent", border: "none", cursor: "pointer", marginTop: 10, fontFamily: "DM Sans,sans-serif" }}>
            Logout
        </button>
      </nav>
      <div style={{ padding: 18, borderTop: "1px solid #EDEDED" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>{initial}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 11, color: "#9A9A9A" }}>Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAFAFA" }}>
      <div style={{ display: "none" }} className="desktop-sb"><SidebarContent /></div>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "relative", zIndex: 1 }}><SidebarContent /></div>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 64, background: "#FFFFFF", borderBottom: "1px solid #EDEDED", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: "#0A0A0A", fontSize: 20, cursor: "pointer" }}>&#9776;</button>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 17, fontWeight: 700, color: "#0A0A0A" }}>{pageTitle}</span>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, color: "#fff", cursor: "pointer" }} onClick={() => window.location.href = "/dashboard/settings"}>{initial}</div>
        </header>
        <main style={{ flex: 1, padding: 28, maxWidth: 1200, width: "100%", margin: "0 auto" }}>{children}</main>
      </div>
      <style>{"@media(min-width:1024px){.desktop-sb{display:block !important}}"}</style>
    </div>
  );
}