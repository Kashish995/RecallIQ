"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err: any) { setError(err.response?.data?.error || "Login failed"); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", padding: "13px 16px", background: "#FAFAFA", border: "1px solid #EDEDED", borderRadius: 12, color: "#0A0A0A", fontSize: 14, fontFamily: "DM Sans,sans-serif", outline: "none" } as any;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 22, padding: 40, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#0A0A0A", letterSpacing: -0.5 }}>RecallIQ</div>
          <p style={{ fontSize: 13, color: "#9A9A9A", marginTop: 8 }}>Welcome back.</p>
        </div>
        {error && <div style={{ background: "#FFF6F6", border: "1px solid #FBDADA", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#C23B3B", marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "#9A9A9A", display: "block", marginBottom: 7 }}>Email</label>
            <input style={inp} type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "#9A9A9A", display: "block", marginBottom: 7 }}>Password</label>
            <input style={inp} type="password" placeholder="Your password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 14, background: "#0A0A0A", color: "#fff", fontSize: 14.5, fontWeight: 700, border: "none", cursor: "pointer" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, color: "#9A9A9A", marginTop: 22 }}>
          No account? <Link href="/register" style={{ color: "#0A0A0A", fontWeight: 700, textDecoration: "underline" }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}