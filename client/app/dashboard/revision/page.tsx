"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
function getRetColor(r: number) { return r >= 60 ? "#10B981" : r >= 40 ? "#F59E0B" : "#EF4444"; }
export default function RevisionPage() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const load = async () => { const res = await api.get("/concepts"); setConcepts(res.data.concepts.sort((a:any,b:any) => a.retention - b.retention)); };
  useEffect(() => { load(); }, []);
  const revise = async (id: string) => { await api.post("/concepts/" + id + "/revise", { score: 85 }); load(); };
  const reviseAll = async () => { await Promise.all(concepts.filter(c => c.retention < 65).map(c => api.post("/concepts/" + c.id + "/revise", { score: 85 }))); load(); };
  const urgent = concepts.filter(c => c.retention < 30);
  const soon = concepts.filter(c => c.retention >= 30 && c.retention < 60);
  const strong = concepts.filter(c => c.retention >= 60);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:20 }}>
        <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:11, textTransform:"uppercase", color:"#EF4444", marginBottom:4 }}>Urgent</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#EF4444", fontFamily:"Syne,sans-serif" }}>{urgent.length}</div>
        </div>
        <div style={{ background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.2)", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:11, textTransform:"uppercase", color:"#F59E0B", marginBottom:4 }}>Review Soon</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#F59E0B", fontFamily:"Syne,sans-serif" }}>{soon.length}</div>
        </div>
        <div style={{ background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.2)", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:11, textTransform:"uppercase", color:"#10B981", marginBottom:4 }}>Strong</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#10B981", fontFamily:"Syne,sans-serif" }}>{strong.length}</div>
        </div>
      </div>
      <div style={{ background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:600 }}>All Concepts by urgency</div>
          <button onClick={reviseAll} style={{ padding:"8px 16px", borderRadius:8, background:"#6C63FF", color:"#fff", border:"none", cursor:"pointer", fontSize:13 }}>Revise All Weak</button>
        </div>
        {concepts.map(c => (
          <div key={c.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:getRetColor(c.retention), flexShrink:0 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{c.name} <span style={{ fontSize:10, color:"#475569" }}>{c.topic}</span></div>
                <div style={{ fontSize:11, color:"#64748B" }}>{c.description}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              <div style={{ width:60, height:4, background:"#1A1C24", borderRadius:2, overflow:"hidden" }}>
                <div style={{ width:c.retention + "%", height:"100%", background:getRetColor(c.retention) }} />
              </div>
              <span style={{ fontSize:12, fontWeight:600, minWidth:34, color:getRetColor(c.retention) }}>{c.retention}%</span>
              <span style={{ fontSize:10, padding:"3px 8px", borderRadius:20, background:c.retention<30?"rgba(239,68,68,.13)":c.retention<60?"rgba(245,158,11,.13)":"rgba(16,185,129,.13)", color:c.retention<30?"#EF4444":c.retention<60?"#F59E0B":"#10B981" }}>
                {c.retention < 30 ? "Urgent" : c.retention < 60 ? "Review" : "Strong"}
              </span>
              <button onClick={() => revise(c.id)} style={{ fontSize:12, padding:"5px 10px", borderRadius:8, background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", color:"#94A3B8", cursor:"pointer" }}>Revise</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}