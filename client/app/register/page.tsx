"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err: any) { setError(err.response?.data?.error || "Registration failed"); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", padding: "13px 16px", background: "#F8F7FC", border: "none", borderRadius: 14, color: "#1A1A2E", fontSize: 14, fontFamily: "DM Sans,sans-serif", outline: "none" } as any;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F2FC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 26, padding: 42, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: 19, margin: "0 auto 14px" }}>R</div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>Create your account</div>
          <p style={{ fontSize: 13, color: "#9A9AA8", marginTop: 6 }}>Free forever. No credit card needed.</p>
        </div>
        {error && <div style={{ background: "#FCE7F3", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#BE185D", marginBottom: 16, fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {([["Full name", "text", "Your name", "name"], ["Email", "email", "you@example.com", "email"], ["Password", "password", "Min 8 characters", "password"], ["Confirm password", "password", "Repeat password", "confirm"]] as const).map(([label, type, placeholder, key]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6B6B80", display: "block", marginBottom: 7 }}>{label}</label>
              <input style={inp} type={type} placeholder={placeholder} required value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 16, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", fontSize: 14.5, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 6 }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, color: "#9A9AA8", marginTop: 22 }}>
          Already have an account? <Link href="/login" style={{ color: "#7C3AED", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}