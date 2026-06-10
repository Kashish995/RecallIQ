"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
function getRetColor(r: number) { return r >= 60 ? "#10B981" : r >= 40 ? "#F59E0B" : "#EF4444"; }
export default function Dashboard() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avg: 0, weak: 0, streak: 0 });
  const curveRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<HTMLCanvasElement>(null);
  const [lambda, setLambda] = useState(0.7);
  const animRef = useRef<number>();
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
  const startSession = async () => { const weak = concepts.filter(c => c.retention < 65); await Promise.all(weak.map(c => api.post("/concepts/" + c.id + "/revise", { score: 85 }))); loadData(); };
  useEffect(() => {
    const fc = curveRef.current; const bc = ballRef.current;
    if (!fc || !bc) return;
    const PAD = { l: 44, r: 16, t: 14, b: 30 };
    const dpr = window.devicePixelRatio || 1;
    let prog = 0; let running = false;
    function setup() { const W = fc!.parentElement!.offsetWidth || 400; const H = 200; [fc!, bc!].forEach(c => { c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px"; }); }
    function tX(t: number) { const W = fc!.width / dpr; return PAD.l + t / 10 * (W - PAD.l - PAD.r); }
    function rY(r: number) { const H = fc!.height / dpr; return PAD.t + (1 - r) * (H - PAD.t - PAD.b); }
    function ret(t: number) { return Math.exp(-lambda * t); }
    function draw() {
      const ctx = fc!.getContext("2d")!; const W = fc!.width / dpr; const H = fc!.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, H - PAD.b); ctx.lineTo(W - PAD.r, H - PAD.b); ctx.stroke();
      ctx.fillStyle = "rgba(148,163,184,0.35)"; ctx.font = "10px DM Sans,sans-serif"; ctx.textAlign = "right";
      [100, 75, 50, 25, 0].forEach(p => { const y = rY(p / 100); ctx.fillText(p + "%", PAD.l - 5, y + 3); ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke(); ctx.setLineDash([]); });
      ctx.textAlign = "center"; ctx.fillStyle = "rgba(148,163,184,0.35)";
      [0, 2, 4, 6, 8, 10].forEach(d => ctx.fillText("d" + d, tX(d), H - PAD.b + 14));
      ctx.beginPath();
      for (let px = 0; px <= (W - PAD.l - PAD.r); px++) { const t = px / (W - PAD.l - PAD.r) * 10; const x = PAD.l + px; const y = rY(ret(t)); px === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.strokeStyle = "#A78BFA"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.lineTo(W - PAD.r, H - PAD.b); ctx.lineTo(PAD.l, H - PAD.b); ctx.closePath(); ctx.fillStyle = "rgba(167,139,250,0.07)"; ctx.fill();
    }
    function drawBall(t: number) {
      const ctx = bc!.getContext("2d")!; const W = bc!.width / dpr; const H = bc!.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const r = ret(t); const x = tX(t); const y = rY(r);
      for (let i = 20; i >= 0; i--) { const tt = Math.max(0, t - i * 0.04); ctx.beginPath(); ctx.arc(tX(tt), rY(ret(tt)), 4 * (1 - i / 24), 0, Math.PI * 2); ctx.fillStyle = "rgba(167,139,250," + (1 - i / 20) * 0.2 + ")"; ctx.fill(); }
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fillStyle = "#A78BFA"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.font = "bold 11px DM Sans,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(Math.round(r * 100) + "%", x, y < PAD.t + 28 ? y + 22 : y - 15);
    }
    function eio(t: number) { return t < 0.5 ? 4 * t * t * t : (1 - Math.pow(-2 * t + 2, 3)) / 2; }
    function animate() { prog += 0.004; if (prog >= 1) { prog = 1; running = false; } drawBall(eio(prog) * 10); if (running) animRef.current = requestAnimationFrame(animate); }
    function replay() { if (animRef.current) cancelAnimationFrame(animRef.current); prog = 0; running = true; animate(); }
    setup(); draw(); setTimeout(replay, 400);
    const interval = setInterval(() => { if (!running) { prog = 0; running = true; animate(); } }, 7000);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); clearInterval(interval); };
  }, [lambda]);
  const due = concepts.filter(c => c.retention < 65).sort((a, b) => a.retention - b.retention).slice(0, 4);
  const card = { background: "rgba(26,28,36,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 } as any;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 24 }}>
        {[{ label: "Memory Score", value: stats.avg + "%", color: "#A78BFA" }, { label: "Concepts", value: stats.total, color: "#22D3EE" }, { label: "Weak Concepts", value: stats.weak, color: "#F59E0B" }, { label: "Streak", value: stats.streak + "d", color: "#10B981" }].map(s => (
          <div key={s.label} style={{ ...card, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
            <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Syne,sans-serif", color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>?? Forgetting Curve <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>R = e^(-?t)</span></div>
          <div style={{ position: "relative", width: "100%", height: 200 }}>
            <canvas ref={curveRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            <canvas ref={ballRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <label style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 7 }}>
              ? <input type="range" min={1} max={20} value={Math.round(lambda * 10)} onChange={e => setLambda(e.target.valueAsNumber / 10)} style={{ width: 90 }} />
              <span style={{ color: "#A78BFA", fontWeight: 600 }}>{lambda.toFixed(1)}</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
            {[["Day 0", "100%", "#10B981"], ["Day 7", Math.round(Math.exp(-lambda * 7) * 100) + "%", "#F59E0B"], ["Day 30", Math.round(Math.exp(-lambda * 30) * 100) + "%", "#EF4444"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "#1A1C24", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "Syne,sans-serif" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>? Revision Queue <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>{due.length} due today</span></div>
          {due.length === 0 ? <div style={{ textAlign: "center", padding: "30px 0", color: "#475569" }}><div style={{ fontSize: 32, marginBottom: 8 }}>??</div>All caught up!</div>
            : due.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div><div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div><div style={{ fontSize: 11, color: "#475569" }}>{c.topic}</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600, background: c.retention < 30 ? "rgba(239,68,68,.13)" : "rgba(245,158,11,.13)", color: c.retention < 30 ? "#EF4444" : "#F59E0B" }}>{c.retention < 30 ? "Urgent" : "Soon"}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: getRetColor(c.retention) }}>{c.retention}%</span>
                  <button onClick={() => revise(c.id)} style={{ fontSize: 12, padding: "5px 10px", borderRadius: 8, background: "#1A1C24", border: "1px solid rgba(255,255,255,0.13)", color: "#94A3B8", cursor: "pointer" }}>Revise</button>
                </div>
              </div>
            ))}
          <button onClick={startSession} style={{ width: "100%", marginTop: 14, padding: 11, borderRadius: 8, background: "#6C63FF", color: "#fff", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>? Start Revision Session</button>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>= All Concepts</div>
        {concepts.length === 0 ? <div style={{ textAlign: "center", padding: 30, color: "#475569" }}>No concepts yet. <a href="/dashboard/upload" style={{ color: "#A78BFA" }}>Upload material ?</a></div>
          : <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {[...concepts].sort((a, b) => a.retention - b.retention).map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", background: "#1A1C24", borderRadius: 8, marginBottom: 6, cursor: "pointer" }} onClick={() => revise(c.id)}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: getRetColor(c.retention) }} />
                <div style={{ flex: 1, fontSize: 13 }}>{c.name} <span style={{ fontSize: 10, color: "#475569" }}>{c.topic}</span></div>
                <div style={{ width: 50, height: 3, background: "#22252F", borderRadius: 2, overflow: "hidden" }}><div style={{ width: c.retention + "%", height: "100%", background: getRetColor(c.retention) }} /></div>
                <span style={{ fontSize: 12, fontWeight: 600, color: getRetColor(c.retention) }}>{c.retention}%</span>
              </div>
            ))}
          </div>}
      </div>
    </div>
  );
}
