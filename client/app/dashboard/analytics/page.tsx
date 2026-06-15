"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import api from "@/lib/api";
export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.get("/analytics").then(r => setData(r.data)).catch(() => {}); }, []);
  if (!data) return <div style={{ textAlign:"center", padding:60, color:"#475569" }}>Loading analytics...</div>;
  const topicData = Object.entries(data.topicBreakdown || {}).map(([t, v]: any) => ({ topic: t, forgotten: v.total ? Math.round(v.weak / v.total * 100) : 0 }));
  const card = { background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:20 } as any;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Concepts", value:data.totalConcepts, color:"#A78BFA" },
          { label:"Avg Retention", value:data.avgRetention + "%", color:"#F59E0B" },
          { label:"Streak", value:data.streak + "d", color:"#10B981" },
          { label:"Total Revisions", value:data.totalRevisions, color:"#22D3EE" },
        ].map(s => (
          <div key={s.label} style={{...card, position:"relative", overflow:"hidden"}}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:s.color }} />
            <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:28, fontWeight:700, fontFamily:"Syne,sans-serif", color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:16, marginBottom:16 }}>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Weekly Learning Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill:"#475569", fontSize:10 }} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} />
              <Tooltip contentStyle={{ background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9" }} />
              <Line type="monotone" dataKey="count" stroke="#6C63FF" strokeWidth={2.5} dot={{ fill:"#A78BFA", r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Most Forgotten by Topic</div>
          {topicData.length > 0
            ? <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topicData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="topic" tick={{ fill:"#475569", fontSize:10 }} />
                  <YAxis tick={{ fill:"#475569", fontSize:10 }} unit="%" />
                  <Tooltip contentStyle={{ background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9" }} />
                  <Bar dataKey="forgotten" fill="#EF4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            : <div style={{ color:"#475569", textAlign:"center", padding:"60px 0" }}>Add concepts to see breakdown</div>
          }
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Activity Heatmap</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
          {Array.from({ length:56 }, (_, i) => {
            const v = Math.floor(Math.random() * 5);
            const op = [0.05, 0.2, 0.4, 0.65, 0.9][v];
            return <div key={i} style={{ width:13, height:13, borderRadius:2, background:"rgba(108,99,255," + op + ")" }} />;
          })}
        </div>
      </div>
    </div>
  );
}