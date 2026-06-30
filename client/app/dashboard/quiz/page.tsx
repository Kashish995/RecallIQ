"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const DIFF_STYLE: any = {
  easy: { bg: "#D1FAE5", fg: "#059669" },
  medium: { bg: "#FEF3C7", fg: "#D97706" },
  hard: { bg: "#FCE7F3", fg: "#DB2777" },
};

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
  const card = { background: "#FFFFFF", borderRadius: 20, padding: 22, marginBottom: 14 } as any;
  const sel = { padding: "10px 14px", background: "#F8F7FC", border: "none", borderRadius: 12, color: "#1A1A2E", fontSize: 13, fontWeight: 600 } as any;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>Quiz center</h2>
          <div style={{ fontSize: 13, color: "#9A9AA8" }}>Score: <span style={{ color: "#7C3AED", fontWeight: 700 }}>{score} / {total}</span>
            {allDone && <span style={{ marginLeft: 8 }}>{Math.round(score / questions.length * 100)}% {score / questions.length >= 0.7 ? "Great job" : "Keep revising"}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={topic} onChange={e => setTopic(e.target.value)} style={sel}>
            <option value="all">All topics</option><option value="DSA">DSA</option><option value="OS">OS</option><option value="DBMS">DBMS</option>
          </select>
          <button onClick={load} style={{ padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>New quiz</button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#9A9AA8" }}>Loading questions...</div> : (
        <div>
          {questions.map((q, i) => {
            const d = DIFF_STYLE[q.difficulty] || DIFF_STYLE.medium;
            return (
              <div key={i} style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11.5, color: "#9A9AA8", fontWeight: 600 }}>Q{i + 1}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: d.bg, color: d.fg }}>{q.difficulty}</span>
                  <span style={{ fontSize: 11.5, color: "#9A9AA8", marginLeft: "auto", fontWeight: 600 }}>{q.topic}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E", marginBottom: 16, lineHeight: 1.5 }}>{q.question}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt: string, j: number) => {
                    const correct = i in answered && j === q.answer;
                    const wrong = answered[i] === j && j !== q.answer;
                    return (
                      <button key={j} disabled={i in answered} onClick={() => answer(i, j)} style={{
                        padding: "12px 16px", textAlign: "left", fontSize: 13.5, fontWeight: 600, borderRadius: 14,
                        background: correct ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : wrong ? "#FCE7F3" : "#F8F7FC",
                        border: "none",
                        color: correct ? "#fff" : wrong ? "#BE185D" : "#1A1A2E",
                        cursor: i in answered ? "default" : "pointer", fontFamily: "DM Sans,sans-serif"
                      }}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {allDone && (
            <div style={{ background: "linear-gradient(120deg,#7C3AED,#5B21B6 55%,#1E1B4B)", borderRadius: 20, padding: 30, textAlign: "center" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{score}/{questions.length}</div>
              <div style={{ fontSize: 14, color: "#D8D2F5", marginBottom: 20 }}>{Math.round(score / questions.length * 100)}% correct</div>
              <button onClick={load} style={{ padding: "11px 26px", borderRadius: 16, background: "#fff", color: "#7C3AED", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 700 }}>Try again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}