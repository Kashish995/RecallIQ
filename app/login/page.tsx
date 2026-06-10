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
  const inp = { width:"100%", padding:"11px 14px", background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9", fontSize:14, fontFamily:"DM Sans,sans-serif", outline:"none" } as any;
  return (
    <div style={{ minHeight:"100vh", background:"#0A0B0F", display:"flex", alignItems:"center", justifyContent:"center", padding:24, backgroundImage:"radial-gradient(ellipse 60% 70% at 50% 0%,rgba(108,99,255,0.12),transparent)" }}>
      <div style={{ background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:16, padding:40, width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800 }}>Recall<span className="grad-text">IQ</span></div>
          <p style={{ fontSize:13, color:"#94A3B8", marginTop:6 }}>Welcome back. Keep learning.</p>
        </div>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Sign in</h2>
        <p style={{ fontSize:13, color:"#94A3B8", marginBottom:24 }}>Enter your credentials to continue</p>
        {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#EF4444", marginBottom:16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, color:"#94A3B8", display:"block", marginBottom:6 }}>Email</label>
            <input style={inp} type="email" placeholder="you@example.com" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, color:"#94A3B8", display:"block", marginBottom:6 }}>Password</label>
            <input style={inp} type="password" placeholder="Your password" required value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} />
          </div>
          <button type="submit" disabled={loading} style={{ width:"100%", padding:12, borderRadius:8, background:"#6C63FF", color:"#fff", fontSize:15, fontWeight:500, border:"none", cursor:"pointer" }}>
            {loading ? "Signing in..." : "Sign in ?"}
          </button>
        </form>
        <p style={{ textAlign:"center", fontSize:13, color:"#94A3B8", marginTop:20 }}>
          No account? <Link href="/register" style={{ color:"#A78BFA" }}>Sign up free ?</Link>
        </p>
      </div>
    </div>
  );
}
