"use client";
import { useState, useRef } from "react";
import api from "@/lib/api";

const inp = { width: "100%", padding: "12px 14px", background: "#FAFAFA", border: "1px solid #EDEDED", borderRadius: 12, color: "#0A0A0A", fontSize: 13, fontFamily: "DM Sans,sans-serif", outline: "none" } as any;
const card = { background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 18, padding: 22, marginBottom: 16 } as any;
const title = { fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 14 } as any;

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
          <div style={title}>Upload material</div>
          <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #DCDCDC", borderRadius: 16, padding: "40px 20px", textAlign: "center", cursor: "pointer", background: "#FAFAFA" }}
            onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>Drop files or click to upload</div>
            <div style={{ fontSize: 12.5, color: "#9A9A9A" }}>PDFs and text files</div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        <div style={card}>
          <div style={title}>Process URL</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="YouTube or article URL..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === "Enter") processUrl(); }} />
            <button onClick={processUrl} disabled={loading} style={{ padding: "12px 18px", borderRadius: 12, background: "#0A0A0A", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Process</button>
          </div>
        </div>

        <div style={card}>
          <div style={title}>Add manually</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="Concept name..." value={manual} onChange={e => setManual(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addManual(); }} />
            <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inp, width: "auto", flex: "none" }}>
              <option>DSA</option><option>OS</option><option>DBMS</option><option>General</option>
            </select>
            <button onClick={addManual} style={{ padding: "12px 18px", borderRadius: 12, background: "#0A0A0A", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
          </div>
        </div>
      </div>

      <div>
        <div style={card}>
          <div style={title}>AI extraction log</div>
          <div style={{ background: "#FAFAFA", border: "1px solid #EDEDED", borderRadius: 12, padding: 14, fontFamily: "monospace", fontSize: 12, color: "#6B6B6B", lineHeight: 2, minHeight: 110 }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
          {extracted.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {extracted.map(c => <span key={c.id} style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, border: "1px solid #0A0A0A", color: "#0A0A0A" }}>{c.name}</span>)}
            </div>
          )}
        </div>

        <div style={card}>
          <div style={title}>Processed materials</div>
          {materials.length === 0 ? <div style={{ color: "#9A9A9A", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Nothing yet.</div>
            : materials.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid #EDEDED" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0A0A0A" }}>{m.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9A9A9A" }}>{m.count} concepts</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, border: "1px solid #0A0A0A", color: "#0A0A0A" }}>Done</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}