"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
export default function QuizPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answered, setAnswered] = useState<Record<number,number>>({});
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("all");
  const load = async () => {
    setLoading(true); setAnswered({});
    try { const res = await api.get("/quiz" + (topic !== "all" ? "?topic=" + topic : "")); setQuestions(res.data.questions); }
    catch(e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [topic]);
  const answer = (qi: number, oi: number) => { if (qi in answered) return; setAnswered(p => ({...p, [qi]: oi})); };
  const score = Object.entries(answered).filter(([i,a]) => questions[+i]?.answer === a).length;
  const total = Object.keys(answered).length;
  const allDone = total === questions.length && questions.length > 0;
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:700, marginBottom:3 }}>Quiz Center</h2>
          <div style={{ fontSize:13, color:"#94A3B8" }}>Score: <span style={{ color:"#A78BFA", fontWeight:600 }}>{score} / {total}</span>
            {allDone && <span style={{ marginLeft:10, color:score/questions.length>=0.7?"#10B981":"#F59E0B" }}>{Math.round(score/questions.length*100)}% {score/questions.length>=0.7?"Great job!":"Keep revising!"}</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <select value={topic} onChange={e => setTopic(e.target.value)} style={{ padding:"8px 12px", background:"#1A1C24", border:"1px solid rgba(255,255,255,0.13)", borderRadius:8, color:"#F1F5F9", fontSize:13 }}>
            <option value="all">All Topics</option>
            <option value="DSA">DSA</option>
            <option value="OS">OS</option>
            <option value="DBMS">DBMS</option>
          </select>
          <button onClick={load} style={{ padding:"8px 16px", borderRadius:8, background:"#6C63FF", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>New Quiz</button>
        </div>
      </div>
      {loading ? <div style={{ textAlign:"center", padding:60, color:"#475569" }}>Loading questions...</div> : (
        <div>
          {questions.map((q, i) => (
            <div key={i} style={{ background:"rgba(26,28,36,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:20, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={{ fontSize:11, color:"#475569" }}>Q{i+1}</span>
                <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:600, background:q.difficulty==="easy"?"rgba(16,185,129,.15)":q.difficulty==="medium"?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)", color:q.difficulty==="easy"?"#10B981":q.difficulty==="medium"?"#F59E0B":"#EF4444" }}>{q.difficulty}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:14, lineHeight:1.6 }}>{q.question}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {q.options.map((opt: string, j: number) => {
                  const correct = i in answered && j === q.answer;
                  const wrong = answered[i] === j && j !== q.answer;
                  return (
                    <button key={j} disabled={i in answered} onClick={() => answer(i, j)}
                      style={{ padding:"10px 14px", background:correct?"rgba(16,185,129,.1)":wrong?"rgba(239,68,68,.1)":"#1A1C24", border:"1px solid " + (correct?"#10B981":wrong?"#EF4444":"rgba(255,255,255,0.07)"), borderRadius:8, cursor:i in answered?"default":"pointer", fontSize:13, textAlign:"left", color:correct?"#10B981":wrong?"#EF4444":"#F1F5F9", fontFamily:"DM Sans,sans-serif" }}>
                      {correct ? "Correct: " : wrong ? "Wrong: " : ""}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {allDone && (
            <div style={{ background:"rgba(108,99,255,.1)", border:"1px solid rgba(108,99,255,.3)", borderRadius:12, padding:28, textAlign:"center", marginTop:8 }}>
              <div style={{ fontSize:40, marginBottom:10 }}>{score/questions.length>=0.7?"":"📚"}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:700, color:"#A78BFA", marginBottom:6 }}>{score}/{questions.length}</div>
              <div style={{ fontSize:14, color:"#94A3B8", marginBottom:20 }}>{Math.round(score/questions.length*100)}% correct</div>
              <button onClick={load} style={{ padding:"10px 28px", borderRadius:8, background:"#6C63FF", color:"#fff", border:"none", cursor:"pointer", fontSize:14 }}>Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}