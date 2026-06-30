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

  const inp = { width: "100%", padding: "13px 16px", background: "#F8F7FC", border: "none", borderRadius: 14, color: "#1A1A2E", fontSize: 14, fontFamily: "DM Sans,sans-serif", outline: "none" } as any;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F2FC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 26, padding: 42, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: 19, margin: "0 auto 14px" }}>R</div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>Welcome back</div>
          <p style={{ fontSize: 13, color: "#9A9AA8", marginTop: 6 }}>Sign in to keep your streak going.</p>
        </div>
        {error && <div style={{ background: "#FCE7F3", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#BE185D", marginBottom: 16, fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6B6B80", display: "block", marginBottom: 7 }}>Email</label>
            <input style={inp} type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6B6B80", display: "block", marginBottom: 7 }}>Password</label>
            <input style={inp} type="password" placeholder="Your password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 16, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", fontSize: 14.5, fontWeight: 700, border: "none", cursor: "pointer" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, color: "#9A9AA8", marginTop: 22 }}>
          No account? <Link href="/register" style={{ color: "#7C3AED", fontWeight: 700, textDecoration: "none" }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}