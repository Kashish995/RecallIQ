"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";

export default function Dashboard() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avg: 0, weak: 0, streak: 0 });
  const curveRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<HTMLCanvasElement>(null);
  const [lambda] = useState(0.7);
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
  const startSession = async () => {
    const weak = concepts.filter(c => c.retention < 65);
    await Promise.all(weak.map(c => api.post("/concepts/" + c.id + "/revise", { score: 85 })));
    loadData();
  };

  useEffect(() => {
    const fc = curveRef.current; const bc = ballRef.current;
    if (!fc || !bc) return;
    const PAD = { l: 6, r: 6, t: 6, b: 6 };
    const dpr = window.devicePixelRatio || 1;
    let prog = 0; let running = false;
    function setup() { const W = fc!.parentElement!.offsetWidth || 400; const H = 90; [fc!, bc!].forEach(c => { c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px"; }); }
    function tX(t: number) { const W = fc!.width / dpr; return PAD.l + t / 10 * (W - PAD.l - PAD.r); }
    function rY(r: number) { const H = fc!.height / dpr; return PAD.t + (1 - r) * (H - PAD.t - PAD.b); }
    function ret(t: number) { return Math.exp(-lambda * t); }
    function draw() {
      const ctx = fc!.getContext("2d")!; const W = fc!.width / dpr; const H = fc!.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      for (let px = 0; px <= (W - PAD.l - PAD.r); px++) { const t = px / (W - PAD.l - PAD.r) * 10; const x = PAD.l + px; const y = rY(ret(t)); px === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.strokeStyle = "#0A0A0A"; ctx.lineWidth = 2; ctx.stroke();
    }
    function drawBall(t: number) {
      const ctx = bc!.getContext("2d")!; const W = bc!.width / dpr; const H = bc!.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const r = ret(t); const x = tX(t); const y = rY(r);
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = "#0A0A0A"; ctx.fill();
    }
    function eio(t: number) { return t < 0.5 ? 4 * t * t * t : (1 - Math.pow(-2 * t + 2, 3)) / 2; }
    function animate() { prog += 0.005; if (prog >= 1) { prog = 1; running = false; } drawBall(eio(prog) * 10); if (running) animRef.current = requestAnimationFrame(animate); }
    function replay() { if (animRef.current) cancelAnimationFrame(animRef.current); prog = 0; running = true; animate(); }
    setup(); draw(); setTimeout(replay, 400);
    const interval = setInterval(() => { if (!running) { prog = 0; running = true; animate(); } }, 6000);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); clearInterval(interval); };
  }, [lambda]);

  const due = concepts.filter(c => c.retention < 65).sort((a, b) => a.retention - b.retention).slice(0, 4);
  const card = { background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 18, padding: 22 } as any;
  const tag = (text: string) => (
    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 11px", borderRadius: 20, border: "1px solid #0A0A0A", color: "#0A0A0A", background: "#fff", display: "inline-block" }}>{text}</span>
  );

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 13, color: "#9A9A9A", marginBottom: 6 }}>Good to see you</div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 34, fontWeight: 800, color: "#0A0A0A", letterSpacing: -1, lineHeight: 1.1, margin: 0 }}>
          You remember<br />{stats.avg}% of what<br />you have learned
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Concepts", value: stats.total },
          { label: "Weak", value: stats.weak },
          { label: "Streak", value: stats.streak + "d" },
          { label: "Memory", value: stats.avg + "%" },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: 18, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Syne,sans-serif", color: "#0A0A0A" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#9A9A9A", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>Forgetting curve</span>
            {tag("Live")}
          </div>
          <div style={{ position: "relative", width: "100%", height: 90, marginBottom: 14 }}>
            <canvas ref={curveRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            <canvas ref={ballRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[["Today", "100%"], ["Day 7", Math.round(Math.exp(-lambda * 7) * 100) + "%"], ["Day 30", Math.round(Math.exp(-lambda * 30) * 100) + "%"]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center", padding: "10px 0", borderTop: "1px solid #EDEDED" }}>
                <div style={{ fontSize: 11, color: "#9A9A9A" }}>{l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0A0A0A", fontFamily: "Syne,sans-serif" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>Due for review</span>
            {tag(due.length + " words")}
          </div>
          {due.length === 0 ? (
            <div style={{ textAlign: "center", padding: "26px 0", color: "#9A9A9A", fontSize: 13 }}>All caught up.</div>
          ) : due.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #EDEDED" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "#9A9A9A" }}>{c.topic}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{c.retention}%</span>
                <button onClick={() => revise(c.id)} style={{ fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 20, background: "#0A0A0A", color: "#fff", border: "none", cursor: "pointer" }}>Revise</button>
              </div>
            </div>
          ))}
          <button onClick={startSession} style={{ width: "100%", marginTop: 16, padding: 13, borderRadius: 14, background: "#0A0A0A", color: "#fff", fontSize: 13.5, fontWeight: 700, border: "none", cursor: "pointer" }}>Start revision session</button>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>All concepts</div>
        {concepts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "#9A9A9A", fontSize: 13 }}>
            No concepts yet. <a href="/dashboard/upload" style={{ color: "#0A0A0A", fontWeight: 600 }}>Upload material</a>
          </div>
        ) : (
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {[...concepts].sort((a, b) => a.retention - b.retention).map(c => (
              <div key={c.id} onClick={() => revise(c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderTop: "1px solid #EDEDED", cursor: "pointer" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "#9A9A9A" }}>{c.topic}</div>
                </div>
                <div style={{ width: 90, height: 6, background: "#F0F0F0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: c.retention + "%", height: "100%", background: "#0A0A0A", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", minWidth: 36, textAlign: "right" }}>{c.retention}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}