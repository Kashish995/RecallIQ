"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) { const p = JSON.parse(u); setForm({ name: p.name || "", email: p.email || "" }); }
  }, []);

  const save = async () => {
    try {
      const res = await api.patch("/auth/me", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { alert("Failed to save"); }
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    localStorage.clear();
    window.location.href = "/login";
  };

  const card = { background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 18, padding: 22, marginBottom: 16 } as any;
  const label = { fontSize: 12.5, fontWeight: 600, color: "#9A9A9A", display: "block", marginBottom: 7 } as any;
  const input = {
    width: "100%", padding: "12px 14px", background: "#FAFAFA", border: "1px solid #EDEDED",
    borderRadius: 12, color: "#0A0A0A", fontSize: 14, fontFamily: "DM Sans,sans-serif", outline: "none"
  } as any;
  const sectionTitle = { fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 18 } as any;

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={card}>
        <div style={sectionTitle}>Profile</div>
        <div style={{ marginBottom: 16 }}>
          <label style={label}>Display name</label>
          <input style={input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={label}>Email</label>
          <input style={input} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        </div>
        <button onClick={save} style={{
          padding: "11px 22px", borderRadius: 12, background: saved ? "#0A0A0A" : "#0A0A0A",
          color: "#fff", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 700, fontFamily: "DM Sans,sans-serif"
        }}>
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Notifications</div>
        {[
          ["Daily revision reminder", "Get reminded to revise weak concepts", true],
          ["Weekly progress report", "Summary of your learning", true],
          ["Forgetting alert", "Alert when a concept drops below 30%", false],
        ].map(([l, s, d], i) => (
          <div key={l as string} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid #EDEDED"
          }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0A0A0A" }}>{l}</div>
              <div style={{ fontSize: 12, color: "#9A9A9A", marginTop: 2 }}>{s}</div>
            </div>
            <input type="checkbox" defaultChecked={d as boolean} style={{ width: 18, height: 18, accentColor: "#0A0A0A" }} />
          </div>
        ))}
      </div>

      <div style={{ background: "#FFF6F6", border: "1px solid #FBDADA", borderRadius: 18, padding: 22 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#C23B3B", marginBottom: 16 }}>Danger zone</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0A0A0A" }}>Sign out</div>
            <div style={{ fontSize: 12, color: "#9A9A9A", marginTop: 2 }}>Log out of your account on this device</div>
          </div>
          <button onClick={logout} style={{
            padding: "10px 18px", borderRadius: 12, background: "transparent",
            border: "1px solid #C23B3B", color: "#C23B3B", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "DM Sans,sans-serif"
          }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}