"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [saved, setSaved] = useState(false);
  useEffect(() => { const u = localStorage.getItem("user"); if (u) { const p = JSON.parse(u); setForm({ name: p.name || "", email: p.email || "" }); } }, []);
  const save = async () => { try { const res = await api.patch("/auth/me", form); localStorage.setItem("user", JSON.stringify(res.data.user)); setSaved(true); setTimeout(() => setSaved(false), 2000); } catch (e) { alert("Failed to save"); } };
  const logout = async () => { await api.post("/auth/logout").catch(() => {}); localStorage.clear(); window.location.href = "/login"; };
  const inp = { width: "100%", padding: "11px 14px", background: "#1A1C24", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 8, color: "#F1F5F9", fontSize: 14, fontFamily: "DM Sans,sans-serif", outline: "none" } as any;
  const card = { background: "rgba(26,28,36,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, marginBottom: 16 } as any;
  return (
    <div style={{ maxWidth: 580 }}>
      <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Settings</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Manage your account and preferences.</p>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>?? Profile</div>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 6 }}>Display name</label><input style={inp} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 6 }}>Email</label><input style={inp} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
        <button onClick={save} style={{ padding: "10px 20px", borderRadius: 8, background: saved ? "#10B981" : "#6C63FF", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans,sans-serif" }}>{saved ? "? Saved!" : "Save Changes"}</button>
      </div>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>?? Notifications</div>
        {[["Daily revision reminder", "Get reminded to revise weak concepts", true], ["Weekly progress report", "Summary of your learning", true], ["Forgetting alert", "Alert when concept drops below 30%", false]].map(([l, s, d]) => (
          <div key={l as string} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div><div style={{ fontSize: 13, fontWeight: 500 }}>{l}</div><div style={{ fontSize: 11, color: "#475569" }}>{s}</div></div>
            <input type="checkbox" defaultChecked={d as boolean} style={{ accentColor: "#6C63FF", width: 16, height: 16 }} />
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#EF4444", marginBottom: 16 }}>? Danger Zone</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: 13, fontWeight: 500 }}>Sign out</div><div style={{ fontSize: 11, color: "#475569" }}>Log out of your account</div></div>
          <button onClick={logout} style={{ padding: "8px 16px", borderRadius: 8, background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans,sans-serif" }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
