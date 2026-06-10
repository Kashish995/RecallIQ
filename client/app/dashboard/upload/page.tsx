"use client";
import { useState, useRef } from "react";
import api from "@/lib/api";
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
    setLoading(true); setLog(["? Reading " + file.name + "..."]);
    const fd = new FormData(); fd.append("file", file);
    try {
      addLog("?? Sending to AI..."); const res = await api.post("/upload/pdf", fd);
      addLog("? " + res.data.count + " concepts extracted!"); setExtracted(res.data.concepts);
      setMaterials(p => [{ title: file.name, type: "pdf", count: res.data.count }, ...p]);
    } catch(e: any) { addLog("? Error: " + (e.response?.data?.error || e.message)); }
    setLoading(false);
  };
  const processUrl = async () => {
    if(!url.trim()) return; setLoading(true); setLog(["? Fetching URL..."]);
    try {
      addLog("?? Extracting concepts..."); const res = await api.post("/upload/url", { url });
      addLog("? " + res.data.count + " concepts extracted!"); setExtracted(res.data.concepts);
      setMaterials(p => [{ title: res.data.material.title||url, type: url.includes("youtube")?"youtube":"article", count: res.data.count }, ...p]);
      setUrl("");
    } catch(e: any) { addLog("? " + (e.response?.data?.error || "Failed")); }
    setLoading(false);
  };
  const addManual = async () => {
    if(!manual.trim()) return;
    await api.post("/concepts", { name: manual.trim(), topic, description: "Manually added." });
    addLog("? Concept added: " + manual); setManual("");
  };
  const inp = { width:"100%", padding:"10px 14px", background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9", fontSize:13, fontFamily:"DM Sans,sans-serif", outline:"none" } as any;
  const card = { background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:20, marginBottom:16 } as any;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16 }}>
      <div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>? Upload Material</div>
          <div onClick={()=>fileRef.current?.click()} style={{ border:"2px dashed rgba(255,255,255,0.13)", borderRadius:12, padding:"36px 20px", textAlign:"center", cursor:"pointer" }}
            onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
            <div style={{ fontSize:40, marginBottom:10, color:"#A78BFA" }}>?</div>
            <div style={{ fontSize:14, fontWeight:500, marginBottom:5 }}>Drop files or click to upload</div>
            <div style={{ fontSize:12, color:"#94A3B8" }}>PDFs and text files</div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md" style={{ display:"none" }} onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}}/>
        </div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>?? Process URL</div>
          <div style={{ display:"flex", gap:8 }}>
            <input style={{ ...inp, flex:1 }} placeholder="YouTube or article URL..." value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")processUrl();}}/>
            <button onClick={processUrl} disabled={loading} style={{ padding:"10px 16px", borderRadius:8, background:"#6C63FF", color:"#fff", border:"none", cursor:"pointer" }}>Process</button>
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>?? Add Manually</div>
          <div style={{ display:"flex", gap:8 }}>
            <input style={{ ...inp, flex:1 }} placeholder="Concept name..." value={manual} onChange={e=>setManual(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addManual();}}/>
            <select value={topic} onChange={e=>setTopic(e.target.value)} style={{ ...inp, width:"auto", flex:"none" }}>
              {["DSA","OS","DBMS","General"].map(t=><option key={t}>{t}</option>)}
            </select>
            <button onClick={addManual} style={{ padding:"10px 16px", borderRadius:8, background:"#6C63FF", color:"#fff", border:"none", cursor:"pointer" }}>+</button>
          </div>
        </div>
      </div>
      <div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>? AI Extraction Log</div>
          <div style={{ background:"#0A0B0F", borderRadius:8, padding:14, fontFamily:"monospace", fontSize:12, color:"#94A3B8", lineHeight:2, minHeight:120 }}>
            {log.map((l,i)=><div key={i}>{l}</div>)}
          </div>
          {extracted.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:12 }}>
            {extracted.map(c=><span key={c.id} style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"rgba(108,99,255,.15)", color:"#A78BFA", border:"1px solid rgba(108,99,255,.25)" }}>{c.name}</span>)}
          </div>}
        </div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>? Processed Materials</div>
          {materials.length===0?<div style={{ color:"#475569", fontSize:13, padding:"20px 0", textAlign:"center" }}>Nothing yet.</div>
            :materials.map((m,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:12, background:"#1A1C24", borderRadius:8, marginBottom:8 }}>
                <div style={{ fontSize:22 }}>{m.type==="pdf"?"??":m.type==="youtube"?"?":"??"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{m.title}</div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>{m.count} concepts</div>
                </div>
                <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:"rgba(16,185,129,.15)", color:"#10B981" }}>Done</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
