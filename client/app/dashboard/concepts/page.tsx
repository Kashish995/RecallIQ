"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
function getRetColor(r: number) { return r >= 60 ? "#10B981" : r >= 40 ? "#F59E0B" : "#EF4444"; }
export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("retention");
  const load = async () => { const res = await api.get("/concepts"); setConcepts(res.data.concepts); };
  useEffect(() => { load(); }, []);
  const revise = async (id: string) => { await api.post("/concepts/" + id + "/revise", { score: 85 }); load(); };
  const del = async (id: string) => { if (confirm("Delete this concept?")) { await api.delete("/concepts/" + id); load(); } };
  let list = filter === "all" ? [...concepts] : concepts.filter(c => c.topic === filter);
  if (sort === "retention") list.sort((a, b) => a.retention - b.retention);
  else list.sort((a, b) => a.name.localeCompare(b.name));
  const sel = { padding:"8px 12px", background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9", fontSize:13 } as any;
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:700 }}>All Concepts</h2>
          <p style={{ fontSize:13, color:"#94A3B8" }}>{list.length} concepts tracked</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={sel}>
            <option value="all">All Topics</option>
            <option value="DSA">DSA</option>
            <option value="OS">OS</option>
            <option value="DBMS">DBMS</option>
            <option value="General">General</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={sel}>
            <option value="retention">Sort: Retention</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>
      <div style={{ background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:20 }}>
        {list.length === 0
          ? <div style={{ textAlign:"center", padding:40, color:"#475569" }}>No concepts yet. <a href="/dashboard/upload" style={{ color:"#A78BFA" }}>Upload material</a></div>
          : list.map(c => (
            <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"#1A1C24", borderRadius:8, marginBottom:6 }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:getRetColor(c.retention), flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500 }}>{c.name} <span style={{ fontSize:10, color:"#475569" }}>{c.topic}</span></div>
                <div style={{ fontSize:11, color:"#64748B" }}>{c.description}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:64, height:4, background:"#22252F", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:c.retention + "%", height:"100%", background:getRetColor(c.retention) }} />
                </div>
                <span style={{ fontSize:12, fontWeight:600, minWidth:36, color:getRetColor(c.retention) }}>{c.retention}%</span>
                <button onClick={() => revise(c.id)} style={{ fontSize:12, padding:"5px 10px", borderRadius:8, background:"rgba(108,99,255,.15)", color:"#A78BFA", border:"1px solid rgba(108,99,255,.3)", cursor:"pointer" }}>Revise</button>
                <button onClick={() => del(c.id)} style={{ fontSize:12, padding:"5px 10px", borderRadius:8, background:"rgba(239,68,68,.1)", color:"#EF4444", border:"1px solid rgba(239,68,68,.2)", cursor:"pointer" }}>X</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}