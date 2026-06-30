"use client";
import { useState, useRef } from "react";
import api from "@/lib/api";

const inp = { width: "100%", padding: "12px 14px", background: "#F8F7FC", border: "none", borderRadius: 14, color: "#1A1A2E", fontSize: 13, fontFamily: "DM Sans,sans-serif", outline: "none" } as any;
const card = { background: "#FFFFFF", borderRadius: 20, padding: 22, marginBottom: 16 } as any;

function cardTitle(icon: string, bg: string, fg: string, text: string) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={"ti " + icon} style={{ fontSize: 17, color: fg }} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{text}</span>
    </div>
  );
}

export default function UploadPage() {
  const [log, setLog] = useState<string[]>(["Waiting for upload..."]);
  const [extracted, setExtracted] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [manual, setManual] = useState("");
  const [topic, setTopic] = useState("DSA");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLog(p => [...p.slice(-7), msg]);

  const handleFile = async (file: File) => {
    setLoading(true); setLog(["Reading " + file.name + "..."]);
    const fd = new FormData(); fd.append("file", file);
    try {
      addLog("Sending to AI...");
      const res = await api.post("/upload/pdf", fd);
      addLog(res.data.count + " concepts extracted.");
      setExtracted(res.data.concepts);
      setMaterials(p => [{ title: file.name, type: "pdf", count: res.data.count }, ...p]);
    } catch (e: any) { addLog("Error: " + (e.response?.data?.error || e.message)); }
    setLoading(false);
  };

  const processUrl = async () => {
    if (!url.trim()) return; setLoading(true); setLog(["Fetching URL..."]);
    try {
      addLog("Extracting concepts...");
      const res = await api.post("/upload/url", { url });
      addLog(res.data.count + " concepts extracted.");
      setExtracted(res.data.concepts);
      setMaterials(p => [{ title: res.data.material.title || url, type: url.includes("youtube") ? "youtube" : "article", count: res.data.count }, ...p]);
      setUrl("");
    } catch (e: any) { addLog(e.response?.data?.error || "Failed"); }
    setLoading(false);
  };

  const addManual = async () => {
    if (!manual.trim()) return;
    await api.post("/concepts", { name: manual.trim(), topic, description: "Manually added." });
    addLog("Concept added: " + manual);
    setManual("");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
      <div>
        <div style={card}>
          {cardTitle("ti-upload", "#EDE9FE", "#7C3AED", "Upload material")}
          <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #DDD7F5", borderRadius: 16, padding: "40px 20px", textAlign: "center", cursor: "pointer", background: "#F8F7FC" }}
            onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <i className="ti ti-cloud-upload" style={{ fontSize: 20, color: "#7C3AED" }} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>Drop files or click to upload</div>
            <div style={{ fontSize: 12.5, color: "#9A9AA8" }}>PDFs and text files</div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        <div style={card}>
          {cardTitle("ti-link", "#FCE7F3", "#DB2777", "Process URL")}
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="YouTube or article URL..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === "Enter") processUrl(); }} />
            <button onClick={processUrl} disabled={loading} style={{ padding: "12px 18px", borderRadius: 14, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Process</button>
          </div>
        </div>

        <div style={card}>
          {cardTitle("ti-bulb", "#FEF3C7", "#D97706", "Add manually")}
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="Concept name..." value={manual} onChange={e => setManual(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addManual(); }} />
            <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inp, width: "auto", flex: "none" }}>
              <option>DSA</option><option>OS</option><option>DBMS</option><option>General</option>
            </select>
            <button onClick={addManual} style={{ padding: "12px 18px", borderRadius: 14, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
          </div>
        </div>
      </div>

      <div>
        <div style={card}>
          {cardTitle("ti-sparkles", "#DBEAFE", "#2563EB", "AI extraction log")}
          <div style={{ background: "#F8F7FC", borderRadius: 14, padding: 14, fontFamily: "monospace", fontSize: 12, color: "#6B6B80", lineHeight: 2, minHeight: 110 }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
          {extracted.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {extracted.map(c => <span key={c.id} style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: "#EDE9FE", color: "#7C3AED" }}>{c.name}</span>)}
            </div>
          )}
        </div>

        <div style={card}>
          {cardTitle("ti-checks", "#D1FAE5", "#059669", "Processed materials")}
          {materials.length === 0 ? <div style={{ color: "#9A9AA8", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Nothing yet.</div>
            : materials.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid #F0EFFA" }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: "#F8F7FC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={"ti " + (m.type === "pdf" ? "ti-file-text" : m.type === "youtube" ? "ti-brand-youtube" : "ti-world")} style={{ fontSize: 16, color: "#7C3AED" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{m.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9A9AA8" }}>{m.count} concepts</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#D1FAE5", color: "#059669" }}>Done</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}