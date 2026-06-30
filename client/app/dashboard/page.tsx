"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { topicStyle, getRetColor, getRetBg } from "@/lib/theme";

export default function Dashboard() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avg: 0, weak: 0, streak: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [cRes, aRes] = await Promise.all([api.get("/concepts"), api.get("/analytics")]);
      setConcepts(cRes.data.concepts);
      const a = aRes.data;
      setStats({ total: a.totalConcepts, avg: a.avgRetention, weak: a.weakConcepts, streak: a.streak });
    } catch (e) { console.error(e); }
  };

  const revise = async (id: string) => { await api.post("/concepts/" + id + "/revise", { score: 85 }); loadData(); };
  const startSession = async () => {
    const weak = concepts.filter(c => c.retention < 65);
    await Promise.all(weak.map(c => api.post("/concepts/" + c.id + "/revise", { score: 85 })));
    loadData();
  };

  const weakest = [...concepts].sort((a, b) => a.retention - b.retention).slice(0, 5);
  const due = [...concepts].filter(c => c.retention < 65).sort((a, b) => a.retention - b.retention).slice(0, 4);
  const card = { background: "#FFFFFF", borderRadius: 20, padding: 22 } as any;

  return (
    <div>
      <div style={{
        background: "linear-gradient(120deg,#7C3AED,#5B21B6 55%,#1E1B4B)", borderRadius: 24, padding: "30px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", marginBottom: 18, flexWrap: "wrap", gap: 20
      }}>
        <div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            You remember {stats.avg}% of what you have learned
          </div>
          <div style={{ fontSize: 13.5, color: "#D8D2F5", marginBottom: 18, maxWidth: 380 }}>
            Powered by the Ebbinghaus forgetting curve. Revise before you forget.
          </div>
          <button onClick={startSession} style={{
            display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: "#5B21B6",
            fontSize: 13, fontWeight: 700, padding: "11px 22px", borderRadius: 24, border: "none", cursor: "pointer"
          }}>
            Start revision session <i className="ti ti-arrow-right" style={{ fontSize: 16 }} />
          </button>
        </div>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-brain" style={{ fontSize: 34, color: "#fff" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>Weak concepts</span>
        <a href="/dashboard/concepts" style={{ fontSize: 12.5, fontWeight: 700, color: "#7C3AED", textDecoration: "none" }}>View all</a>
      </div>

      {weakest.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: "#9A9AA8", fontSize: 13, marginBottom: 18 }}>
          No concepts yet. <a href="/dashboard/upload" style={{ color: "#7C3AED", fontWeight: 700 }}>Upload material</a> to get started.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 22 }}>
          {weakest.map(c => {
            const ts = topicStyle(c.topic);
            return (
              <div key={c.id} onClick={() => revise(c.id)} style={{ ...card, padding: "16px 14px", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ts.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <i className={"ti " + ts.icon} style={{ fontSize: 19, color: ts.fg }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E", marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#9A9AA8", marginBottom: 8 }}>{c.topic}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: getRetColor(c.retention), background: getRetBg(c.retention), padding: "3px 9px", borderRadius: 14 }}>{c.retention}%</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 12 }}>Revision queue</div>
          {due.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#9A9AA8", fontSize: 13 }}>All caught up.</div>
          ) : due.map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid #F0EFFA" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: getRetColor(c.retention) }} />
                <span style={{ fontSize: 13, color: "#1A1A2E", fontWeight: 600 }}>{c.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: getRetColor(c.retention), background: getRetBg(c.retention), padding: "3px 10px", borderRadius: 14 }}>{c.retention}%</span>
                <button onClick={() => revise(c.id)} style={{ fontSize: 11.5, fontWeight: 700, padding: "6px 13px", borderRadius: 16, background: "#7C3AED", color: "#fff", border: "none", cursor: "pointer" }}>Revise</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,#1E1B4B,#312E81)", borderRadius: 20, padding: "20px 22px", color: "#fff" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Memory streak</div>
          <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 30, fontWeight: 800, marginBottom: 2 }}>{stats.streak} days</div>
          <div style={{ fontSize: 11.5, color: "#A5A0E0" }}>{stats.total} concepts tracked</div>
        </div>
      </div>

      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>All concepts</div>
        {concepts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "#9A9AA8", fontSize: 13 }}>Nothing here yet.</div>
        ) : (
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {[...concepts].sort((a, b) => a.retention - b.retention).map((c, i) => (
              <div key={c.id} onClick={() => revise(c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid #F0EFFA", cursor: "pointer" }}>
                <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{c.name} <span style={{ fontSize: 11, color: "#9A9AA8", fontWeight: 500 }}>{c.topic}</span></div>
                <div style={{ width: 80, height: 6, background: "#F0EFFA", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: c.retention + "%", height: "100%", background: getRetColor(c.retention) }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: getRetColor(c.retention), minWidth: 36, textAlign: "right" }}>{c.retention}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}