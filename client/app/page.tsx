"use client";
import Link from "next/link";

export default function Home() {
  const navLink = { color: "#6B6B6B", fontSize: 14, textDecoration: "none" } as any;
  const featureCard = { background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 18, padding: 26 } as any;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#0A0A0A" }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px",
        borderBottom: "1px solid #EDEDED", position: "sticky", top: 0, background: "#FFFFFF", zIndex: 100
      }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800, color: "#0A0A0A", letterSpacing: -0.5 }}>RecallIQ</div>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <Link href="/login" style={navLink}>Login</Link>
          <Link href="/register" style={{ background: "#0A0A0A", color: "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Get started free</Link>
        </div>
      </nav>

      <section style={{ textAlign: "center", padding: "110px 24px 90px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", fontSize: 12.5, fontWeight: 700, padding: "7px 16px", borderRadius: 20, border: "1px solid #0A0A0A", color: "#0A0A0A", marginBottom: 32 }}>
          Powered by Ebbinghaus forgetting science
        </div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(40px,7vw,76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, color: "#0A0A0A" }}>
          Stop forgetting<br />what you have learned.
        </h1>
        <p style={{ fontSize: 17, color: "#6B6B6B", maxWidth: 560, margin: "0 auto 38px", lineHeight: 1.7 }}>
          RecallIQ tracks every concept you study, calculates exactly when you will forget it, and reschedules revision at the perfect moment.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
          <Link href="/register" style={{ background: "#0A0A0A", color: "#fff", padding: "15px 30px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Start for free</Link>
          <Link href="/login" style={{ background: "#FFFFFF", color: "#0A0A0A", padding: "15px 30px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "1px solid #0A0A0A", textDecoration: "none" }}>Login</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[["47k+", "Concepts tracked"], ["92%", "Avg retention rate"], ["3.2k", "Students using it"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: 30, fontWeight: 800, color: "#0A0A0A" }}>{n}</div>
              <div style={{ fontSize: 12.5, color: "#9A9A9A", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, marginBottom: 50, color: "#0A0A0A" }}>
          Everything your brain needs
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, textAlign: "left" }}>
          {[
            ["Smart upload", "PDFs, YouTube URLs, or articles. AI extracts every concept automatically."],
            ["Knowledge graph", "See how concepts connect. Live visual map of everything you know."],
            ["Forgetting engine", "Real-time retention scores. Know what you are about to forget."],
            ["AI quiz generator", "Auto-generated questions tailored to your weakest concepts."],
            ["Spaced repetition", "Day 1 to 3 to 7 to 15 to 30 schedule, built around how memory works."],
            ["Semantic search", "Search the way you think. Finds the right concept instantly."],
          ].map(([title, desc]) => (
            <div key={title} style={featureCard}>
              <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#0A0A0A" }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: "#6B6B6B", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: "center", padding: "90px 24px", background: "#FAFAFA" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginBottom: 16, color: "#0A0A0A" }}>
          Ready to actually remember what you learn?
        </h2>
        <p style={{ fontSize: 16, color: "#6B6B6B", marginBottom: 34 }}>Join thousands of students who stopped forgetting.</p>
        <Link href="/register" style={{ background: "#0A0A0A", color: "#fff", padding: "15px 30px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Create free account</Link>
      </section>

      <footer style={{ borderTop: "1px solid #EDEDED", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 800, color: "#0A0A0A" }}>RecallIQ</div>
        <p style={{ fontSize: 12.5, color: "#9A9A9A" }}>2025 RecallIQ. Built for learners.</p>
      </footer>
    </div>
  );
}