"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { href: "/dashboard/upload", label: "Upload", icon: "ti-upload" },
  { href: "/dashboard/graph", label: "Knowledge graph", icon: "ti-sitemap" },
  { href: "/dashboard/quiz", label: "Quiz center", icon: "ti-brain" },
  { href: "/dashboard/revision", label: "Revision queue", icon: "ti-refresh" },
  { href: "/dashboard/concepts", label: "All concepts", icon: "ti-list" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "ti-chart-bar" },
  { href: "/dashboard/search", label: "Search", icon: "ti-search" },
  { href: "/dashboard/settings", label: "Settings", icon: "ti-settings" },
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
    <aside style={{ width: 252, background: "#FFFFFF", borderRadius: 24, padding: "20px 16px", display: "flex", flexDirection: "column", height: "calc(100vh - 32px)", margin: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: 15 }}>R</div>
        <span style={{ fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: 17, color: "#1A1A2E" }}>RecallIQ</span>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
        {NAV.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", gap: 11, padding: "11px 14px", borderRadius: 13,
              fontSize: 13.5, fontWeight: active ? 700 : 500,
              color: active ? "#fff" : "#6B6B80",
              background: active ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "transparent",
              textDecoration: "none", transition: "all .15s"
            }}>
              <i className={"ti " + icon} style={{ fontSize: 18 }} />{label}
            </Link>
          );
        })}
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 14px", borderRadius: 13, fontSize: 13.5, fontWeight: 500, color: "#6B6B80", background: "transparent", border: "none", cursor: "pointer", marginTop: 6, fontFamily: "DM Sans,sans-serif", textAlign: "left" }}>
          <i className="ti ti-logout" style={{ fontSize: 18 }} />Logout
        </button>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 10px", borderRadius: 14, background: "#F8F7FC" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#FBBF24,#F472B6)", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{user?.name || "User"}</div>
          <div style={{ fontSize: 11, color: "#9A9AA8" }}>Free plan</div>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F2FC" }}>
      <div style={{ display: "none" }} className="desktop-sb"><SidebarContent /></div>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "relative", zIndex: 1 }}><SidebarContent /></div>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: "16px 20px 16px 0" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setOpen(true)} style={{ background: "#fff", border: "none", borderRadius: 12, width: 38, height: 38, color: "#1A1A2E", fontSize: 18, cursor: "pointer" }} className="mobile-only">
              <i className="ti ti-menu-2" />
            </button>
            <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 19, fontWeight: 800, color: "#1A1A2E" }}>{pageTitle}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#FBBF24,#F472B6)", cursor: "pointer" }} onClick={() => window.location.href = "/dashboard/settings"} />
          </div>
        </header>
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <style>{"@media(min-width:1024px){.desktop-sb{display:block !important}.mobile-only{display:none !important}}"}</style>
    </div>
  );
}