"use client";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { topicStyle, getRetColor, getRetBg } from "@/lib/theme";

const ROOT_COLOR: Record<string, string> = { DSA: "#7C3AED", OS: "#DB2777", DBMS: "#2563EB" };

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
    const H = 380;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    const roots = [
      { id: "DSA", x: 0.5, y: 0.14, r: 32 },
      { id: "OS", x: 0.18, y: 0.14, r: 30 },
      { id: "DBMS", x: 0.82, y: 0.14, r: 28 },
    ];
    const positions: any = {
      DSA: [{ x: 0.35, y: 0.4 }, { x: 0.5, y: 0.6 }, { x: 0.63, y: 0.38 }, { x: 0.42, y: 0.77 }, { x: 0.57, y: 0.74 }],
      OS: [{ x: 0.08, y: 0.44 }, { x: 0.22, y: 0.6 }, { x: 0.08, y: 0.72 }, { x: 0.2, y: 0.3 }, { x: 0.33, y: 0.74 }],
      DBMS: [{ x: 0.75, y: 0.4 }, { x: 0.91, y: 0.56 }, { x: 0.75, y: 0.66 }, { x: 0.88, y: 0.74 }, { x: 0.65, y: 0.57 }],
    };
    const filtered = filter === "all" ? concepts : concepts.filter(c => c.topic === filter);
    const shownRoots = filter === "all" ? roots : roots.filter(r => r.id === filter);
    let html = "";
    filtered.forEach((c: any, i: number) => {
      const pos = positions[c.topic]?.[i % 5];
      const root = roots.find(r => r.id === c.topic);
      if (!pos || !root) return;
      html += '<line x1="' + (root.x * W) + '" y1="' + (root.y * H) + '" x2="' + (pos.x * W) + '" y2="' + (pos.y * H) + '" stroke="#E5E1F7" stroke-width="2"/>';
    });
    shownRoots.forEach((n: any) => {
      const x = n.x * W; const y = n.y * H; const color = ROOT_COLOR[n.id];
      html += '<g><circle cx="' + x + '" cy="' + y + '" r="' + n.r + '" fill="' + color + '"/><text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="#FFFFFF" font-size="12" font-family="Outfit,sans-serif" font-weight="700">' + n.id + '</text></g>';
    });
    filtered.forEach((c: any, i: number) => {
      const pos = positions[c.topic]?.[i % 5];
      if (!pos) return;
      const x = pos.x * W; const y = pos.y * H;
      const color = ROOT_COLOR[c.topic] || "#D97706";
      const rc = getRetColor(c.retention);
      const label = c.name.length > 11 ? c.name.slice(0, 10) + "..." : c.name;
      html += '<g style="cursor:pointer" onclick="window.__selectNode(\'' + c.id + '\')"><circle cx="' + x + '" cy="' + y + '" r="20" fill="#FFFFFF" stroke="' + color + '" stroke-width="2"/><circle cx="' + (x + 14) + '" cy="' + (y - 14) + '" r="6" fill="' + rc + '" stroke="#FFFFFF" stroke-width="2"/><text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="#1A1A2E" font-size="9.5" font-family="Outfit,sans-serif" font-weight="600">' + label + '</text></g>';
    });
    svg.innerHTML = html;
  };

  useEffect(() => {
    (window as any).__selectNode = (id: string) => { setSelected(concepts.find(c => c.id === id) || null); };
  }, [concepts]);

  const revise = async (id: string) => {
    await api.post("/concepts/" + id + "/revise", { score: 85 });
    const res = await api.get("/concepts");
    setConcepts(res.data.concepts);
    setSelected(null);
  };

  const card = { background: "#FFFFFF", borderRadius: 20, padding: 22 } as any;
  const sel = { padding: "9px 14px", background: "#F8F7FC", border: "none", borderRadius: 12, color: "#1A1A2E", fontSize: 12.5, fontWeight: 600 } as any;

  return (
    <div>
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>Knowledge graph</div>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={sel}>
              <option value="all">All topics</option><option value="DSA">DSA</option><option value="OS">OS</option><option value="DBMS">DBMS</option>
            </select>
            <button onClick={() => setFilter("all")} style={{ ...sel, cursor: "pointer", border: "none" }}>Reset</button>
          </div>
        </div>
        <div style={{ background: "#F8F7FC", borderRadius: 16, overflow: "hidden", height: 380 }}>
          {concepts.length === 0
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9A9AA8", flexDirection: "column", gap: 10 }}>
                <a href="/dashboard/upload" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 700 }}>Upload material to build your graph</a>
              </div>
            : <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
          }
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          {[["#7C3AED", "DSA"], ["#DB2777", "OS"], ["#2563EB", "DBMS"]].map(([c, l]) => (
            <span key={l} style={{ fontSize: 12, color: "#6B6B80", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
            </span>
          ))}
          <span style={{ fontSize: 12, color: "#9A9AA8" }}>Click a node for details</span>
        </div>
      </div>

      {selected && (
        <div style={card}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: topicStyle(selected.topic).bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={"ti " + topicStyle(selected.topic).icon} style={{ fontSize: 20, color: topicStyle(selected.topic).fg }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "#9A9AA8", marginBottom: 8 }}>
                  {selected.topic} - Retention:{" "}
                  <span style={{ color: getRetColor(selected.retention), fontWeight: 700, background: getRetBg(selected.retention), padding: "2px 9px", borderRadius: 12 }}>{selected.retention}%</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#6B6B80", lineHeight: 1.6, maxWidth: 400 }}>{selected.description}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSelected(null)} style={{ padding: "9px 16px", borderRadius: 14, background: "#F8F7FC", border: "none", color: "#1A1A2E", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Close</button>
              <button onClick={() => revise(selected.id)} style={{ padding: "9px 16px", borderRadius: 14, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Revise now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}