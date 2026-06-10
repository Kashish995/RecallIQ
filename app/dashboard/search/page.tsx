"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
function getRetColor(r: number) { return r >= 60 ? "#10B981" : r >= 40 ? "#F59E0B" : "#EF4444"; }
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => { api.get("/concepts").then(r => setAll(r.data.concepts)); }, []);
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    let list = filter === "all" ? all : all.filter(c => c.topic === filter);
    setResults(list.filter(c => c.name.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)));
  }, [query, filter, all]);
  const revise = async (id: string) => { await api.post("/concepts/" + id + "/revise", { score: 85 }); const res = await api.get("/concepts"); setAll(res.data.concepts); };
  const hl = (text: string) => { if (!query.trim()) return text; const re = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); return text.replace(re, '<mark style="background:rgba(108,99,255,.3);color:#A78BFA;border-radius:2px;padding:0 2px">$1</mark>'); };
  return (
    <div>
      <div style={{ marginBottom: 20 }}><h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Semantic Search</h2><p style={{ fontSize: 13, color: "#94A3B8" }}>Search your knowledge base.</p></div>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#475569" }}>??</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="What did I learn about Deadlock?" style={{ width: "100%", padding: "13px 16px 13px 44px", background: "#1A1C24", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 12, color: "#F1F5F9", fontSize: 14, fontFamily: "DM Sans,sans-serif", outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "DSA", "OS", "DBMS", "General"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "DM Sans,sans-serif", background: filter === f ? "#6C63FF" : "#1A1C24", color: filter === f ? "#fff" : "#94A3B8" }}>{f === "all" ? "All Topics" : f}</button>
        ))}
      </div>
      {!query.trim() ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}><div style={{ fontSize: 40, opacity: 0.3, marginBottom: 12 }}>??</div>Start typing to search</div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>No results for "{query}"</div>
      ) : results.map(c => (
        <div key={c.id} onClick={() => revise(c.id)} style={{ padding: 16, background: "rgba(26,28,36,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, marginBottom: 8, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: hl(c.name) }} />
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "rgba(108,99,255,.15)", color: "#A78BFA" }}>{c.topic}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: getRetColor(c.retention) }}>{c.retention}%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: hl(c.description || "") }} />
          <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>Click to revise</div>
        </div>
      ))}
    </div>
  );
}
