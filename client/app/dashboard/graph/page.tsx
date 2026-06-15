"use client";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
function getRetColor(r: number) { return r >= 60 ? "#10B981" : r >= 40 ? "#F59E0B" : "#EF4444"; }
export default function GraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => { api.get("/concepts").then(r => setConcepts(r.data.concepts)); }, []);
  useEffect(() => { if (concepts.length) drawGraph(); }, [concepts, filter]);
  const drawGraph = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const W = svg.parentElement!.offsetWidth || 700;
    const H = 360;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    const roots = [
      { id: "DSA", x: 0.5, y: 0.12, r: 30, color: "#6C63FF" },
      { id: "OS", x: 0.18, y: 0.12, r: 28, color: "#22D3EE" },
      { id: "DBMS", x: 0.82, y: 0.12, r: 26, color: "#10B981" },
    ];
    const positions = {
      DSA: [{ x: 0.35, y: 0.38 }, { x: 0.5, y: 0.58 }, { x: 0.63, y: 0.36 }, { x: 0.42, y: 0.75 }, { x: 0.57, y: 0.72 }],
      OS: [{ x: 0.08, y: 0.42 }, { x: 0.22, y: 0.58 }, { x: 0.08, y: 0.70 }, { x: 0.2, y: 0.28 }, { x: 0.33, y: 0.72 }],
      DBMS: [{ x: 0.75, y: 0.38 }, { x: 0.91, y: 0.54 }, { x: 0.75, y: 0.64 }, { x: 0.88, y: 0.72 }, { x: 0.65, y: 0.55 }],
    } as any;
    const topicColors = { DSA: "#A78BFA", OS: "#22D3EE", DBMS: "#10B981", General: "#F59E0B" } as any;
    const filtered = filter === "all" ? concepts : concepts.filter(c => c.topic === filter);
    const shownRoots = filter === "all" ? roots : roots.filter(r => r.id === filter);
    let html = "";
    filtered.forEach((c, i) => {
      const pos = positions[c.topic]?.[i % 5];
      const root = roots.find(r => r.id === c.topic);
      if (!pos || !root) return;
      html += '<line x1="' + (root.x * W) + '" y1="' + (root.y * H) + '" x2="' + (pos.x * W) + '" y2="' + (pos.y * H) + '" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>';
    });
    shownRoots.forEach((n: any) => {
      const x = n.x * W; const y = n.y * H;
      html += '<g style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="' + n.r + '" fill="' + n.color + '22" stroke="' + n.color + '" stroke-width="2.5"/><text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="' + n.color + '" font-size="11" font-family="Syne,sans-serif" font-weight="700">' + n.id + '</text></g>';
    });
    filtered.forEach((c: any, i: number) => {
      const pos = positions[c.topic]?.[i % 5];
      if (!pos) return;
      const x = pos.x * W; const y = pos.y * H;
      const color = topicColors[c.topic] || "#94A3B8";
      const rc = getRetColor(c.retention);
      const label = c.name.length > 11 ? c.name.slice(0, 10) + "..." : c.name;
      html += '<g style="cursor:pointer" onclick="window.__selectNode(\'' + c.id + '\')"><circle cx="' + x + '" cy="' + y + '" r="18" fill="' + color + '1A" stroke="' + color + '" stroke-width="1.5"/><circle cx="' + (x + 13) + '" cy="' + (y - 13) + '" r="5" fill="' + rc + '" stroke="#0A0B0F" stroke-width="1.5"/><text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="#CBD5E1" font-size="9" font-family="Syne,sans-serif">' + label + '</text></g>';
    });
    svg.innerHTML = html;
  };
  useEffect(() => {
    (window as any).__selectNode = (id: string) => {
      setSelected(concepts.find(c => c.id === id) || null);
    };
  }, [concepts]);
  const revise = async (id: string) => {
    await api.post("/concepts/" + id + "/revise", { score: 85 });
    const res = await api.get("/concepts");
    setConcepts(res.data.concepts);
    setSelected(null);
  };
  return (
    <div>
      <div style={{ background: "rgba(26,28,36,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Knowledge Graph</div>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "6px 12px", background: "#1A1C24", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 8, color: "#F1F5F9", fontSize: 12 }}>
              <option value="all">All Topics</option>
              <option value="DSA">DSA</option>
              <option value="OS">OS</option>
              <option value="DBMS">DBMS</option>
            </select>
            <button onClick={() => setFilter("all")} style={{ padding: "6px 12px", borderRadius: 8, background: "#1A1C24", border: "1px solid rgba(255,255,255,0.13)", color: "#94A3B8", cursor: "pointer", fontSize: 12 }}>Reset</button>
          </div>
        </div>
        <div style={{ background: "#0A0B0F", borderRadius: 8, overflow: "hidden", height: 360 }}>
          {concepts.length === 0
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 48, opacity: 0.2 }}>o</div>
                <a href="/dashboard/upload" style={{ color: "#A78BFA", fontSize: 13 }}>Upload material to build your graph</a>
              </div>
            : <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
          }
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#6C63FF", display: "inline-block" }} />DSA</span>
          <span style={{ fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22D3EE", display: "inline-block" }} />OS</span>
          <span style={{ fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />DBMS</span>
          <span style={{ fontSize: 11, color: "#475569" }}>Click node for details</span>
        </div>
      </div>
      {selected && (
        <div style={{ background: "rgba(26,28,36,0.95)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
                {selected.topic} - Retention: <span style={{ color: getRetColor(selected.retention), fontWeight: 600 }}>{selected.retention}%</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{selected.description}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSelected(null)} style={{ padding: "7px 14px", borderRadius: 8, background: "#1A1C24", border: "1px solid rgba(255,255,255,0.13)", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>Close</button>
              <button onClick={() => revise(selected.id)} style={{ padding: "7px 14px", borderRadius: 8, background: "#6C63FF", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>Revise Now</button>
            </div>
          </div>
          <div style={{ marginTop: 12, height: 4, background: "#1A1C24", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: selected.retention + "%", height: "100%", background: getRetColor(selected.retention), borderRadius: 2 }} />
          </div>
        </div>
      )}
    </div>
  );
}