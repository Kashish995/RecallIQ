"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { topicStyle, getRetColor, getRetBg } from "@/lib/theme";

export default function RevisionPage() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const load = async () => { const res = await api.get("/concepts"); setConcepts(res.data.concepts.sort((a: any, b: any) => a.retention - b.retention)); };
  useEffect(() => { load(); }, []);

  const revise = async (id: string) => { await api.post("/concepts/" + id + "/revise", { score: 85 }); load(); };
  const reviseAll = async () => { await Promise.all(concepts.filter(c => c.retention < 65).map(c => api.post("/concepts/" + c.id + "/revise", { score: 85 }))); load(); };

  const urgent = concepts.filter(c => c.retention < 30);
  const soon = concepts.filter(c => c.retention >= 30 && c.retention < 60);
  const strong = concepts.filter(c => c.retention >= 60);
  const card = { background: "#FFFFFF", borderRadius: 20, padding: 22 } as any;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#FCE7F3", borderRadius: 20, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#BE185D", marginBottom: 6, fontWeight: 700 }}>Urgent</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#DB2777", fontFamily: "Outfit,sans-serif" }}>{urgent.length}</div>
        </div>
        <div style={{ background: "#FEF3C7", borderRadius: 20, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#92580B", marginBottom: 6, fontWeight: 700 }}>Review soon</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706", fontFamily: "Outfit,sans-serif" }}>{soon.length}</div>
        </div>
        <div style={{ background: "#D1FAE5", borderRadius: 20, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#047857", marginBottom: 6, fontWeight: 700 }}>Strong</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#059669", fontFamily: "Outfit,sans-serif" }}>{strong.length}</div>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>All concepts by urgency</div>
          <button onClick={reviseAll} style={{ padding: "10px 18px", borderRadius: 14, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Revise all weak</button>
        </div>
        {concepts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "#9A9AA8", fontSize: 13 }}>No concepts yet.</div>
        ) : concepts.map((c, i) => {
          const ts = topicStyle(c.topic);
          return (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderTop: i === 0 ? "none" : "1px solid #F0EFFA", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: ts.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={"ti " + ts.icon} style={{ fontSize: 16, color: ts.fg }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{c.name} <span style={{ fontSize: 11, color: "#9A9AA8", fontWeight: 500 }}>{c.topic}</span></div>
                  <div style={{ fontSize: 11.5, color: "#9A9AA8" }}>{c.description}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 70, height: 6, background: "#F0EFFA", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: c.retention + "%", height: "100%", background: getRetColor(c.retention) }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, minWidth: 38, color: getRetColor(c.retention) }}>{c.retention}%</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: getRetBg(c.retention), color: getRetColor(c.retention) }}>
                  {c.retention < 30 ? "Urgent" : c.retention < 60 ? "Review" : "Strong"}
                </span>
                <button onClick={() => revise(c.id)} style={{ fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 18, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", cursor: "pointer" }}>Revise</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}