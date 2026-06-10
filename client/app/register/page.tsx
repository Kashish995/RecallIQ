"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
export default function RegisterPage() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name:form.name, email:form.email, password:form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err: any) { setError(err.response?.data?.error || "Registration failed"); }
    finally { setLoading(false); }
  };
  const inp = { width:"100%", padding:"11px 14px", background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9", fontSize:14, fontFamily:"DM Sans,sans-serif", outline:"none" } as any;
  return (
    <div style={{ minHeight:"100vh", background:"#0A0B0F", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:16, padding:40, width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800 }}>RecallIQ</div>
          <p style={{ fontSize:13, color:"#94A3B8", marginTop:6 }}>Start remembering everything.</p>
        </div>
        {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#EF4444", marginBottom:16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {([["Full name","text","Your name","name"],["Email","email","you@example.com","email"],["Password","password","Min 8 characters","password"],["Confirm password","password","Repeat password","confirm"]] as const).map(([label,type,placeholder,key])=>(
            <div key={key} style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, color:"#94A3B8", display:"block", marginBottom:6 }}>{label}</label>
              <input style={inp} type={type} placeholder={placeholder} required value={(form as any)[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:"100%", padding:12, borderRadius:8, background:"#6C63FF", color:"#fff", fontSize:15, fontWeight:500, border:"none", cursor:"pointer", marginTop:4 }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p style={{ textAlign:"center", fontSize:13, color:"#94A3B8", marginTop:20 }}>
          Already have an account? <Link href="/login" style={{ color:"#A78BFA" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
