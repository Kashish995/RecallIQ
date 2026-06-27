"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function QuizPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("all");

  const load = async () => {
    setLoading(true); setAnswered({});
    try { const res = await api.get("/quiz" + (topic !== "all" ? "?topic=" + topic : "")); setQuestions(res.data.questions); }
    catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [topic]);

  const answer = (qi: number, oi: number) => { if (qi in answered) return; setAnswered(p => ({ ...p, [qi]: oi })); };
  const score = Object.entries(answered).filter(([i, a]) => questions[+i]?.answer === a).length;
  const total = Object.keys(answered).length;
  const allDone = total === questions.length && questions.length > 0;
  const card = { background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 18, padding: 22, marginBottom: 14 } as any;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800, color: "#0A0A0A", marginBottom: 4 }}>Quiz center</h2>
          <div style={{ fontSize: 13, color: "#9A9A9A" }}>Score: <span style={{ color: "#0A0A0A", fontWeight: 700 }}>{score} / {total}</span>
            {allDone && <span style={{ marginLeft: 8 }}>{Math.round(score / questions.length * 100)}% {score / questions.length >= 0.7 ? "Great job" : "Keep revising"}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={topic} onChange={e => setTopic(e.target.value)} style={{ padding: "10px 14px", background: "#FAFAFA", border: "1px solid #EDEDED", borderRadius: 12, color: "#0A0A0A", fontSize: 13, fontWeight: 600 }}>
            <option value="all">All topics</option><option value="DSA">DSA</option><option value="OS">OS</option><option value="DBMS">DBMS</option>
          </select>
          <button onClick={load} style={{ padding: "10px 18px", borderRadius: 12, background: "#0A0A0A", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>New quiz</button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#9A9A9A" }}>Loading questions...</div> : (
        <div>
          {questions.map((q, i) => (
            <div key={i} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11.5, color: "#9A9A9A", fontWeight: 600 }}>Q{i + 1}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #0A0A0A", color: "#0A0A0A" }}>{q.difficulty}</span>
                <span style={{ fontSize: 11.5, color: "#9A9A9A", marginLeft: "auto" }}>{q.topic}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", marginBottom: 16, lineHeight: 1.5 }}>{q.question}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt: string, j: number) => {
                  const correct = i in answered && j === q.answer;
                  const wrong = answered[i] === j && j !== q.answer;
                  return (
                    <button key={j} disabled={i in answered} onClick={() => answer(i, j)} style={{
                      padding: "12px 16px", textAlign: "left", fontSize: 13.5, fontWeight: 600, borderRadius: 12,
                      background: correct ? "#0A0A0A" : wrong ? "#FFF6F6" : "#FAFAFA",
                      border: correct ? "1px solid #0A0A0A" : wrong ? "1px solid #FBDADA" : "1px solid #EDEDED",
                      color: correct ? "#fff" : wrong ? "#C23B3B" : "#0A0A0A",
                      cursor: i in answered ? "default" : "pointer", fontFamily: "DM Sans,sans-serif"
                    }}>{opt}</button>
                  );
                })}
              </div>
            </div>
          ))}
          {allDone && (
            <div style={{ background: "#0A0A0A", borderRadius: 18, padding: 30, textAlign: "center" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{score}/{questions.length}</div>
              <div style={{ fontSize: 14, color: "#C9C9C9", marginBottom: 20 }}>{Math.round(score / questions.length * 100)}% correct</div>
              <button onClick={load} style={{ padding: "11px 26px", borderRadius: 12, background: "#fff", color: "#0A0A0A", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 700 }}>Try again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}