"use client";
import Link from "next/link";
export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0F", color: "#F1F5F9" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, background: "rgba(10,11,15,0.95)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800 }}>Recall<span style={{ background: "linear-gradient(135deg,#6C63FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IQ</span></div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none" }}>Login</Link>
          <Link href="/register" style={{ background: "#6C63FF", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Get Started Free</Link>
        </div>
      </nav>
      <section style={{ textAlign: "center", padding: "100px 24px 80px", background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(108,99,255,0.15),transparent)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, padding: "6px 14px", borderRadius: 20, background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", color: "#A78BFA", marginBottom: 28 }}>? Powered by Ebbinghaus Forgetting Science</div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(38px,6vw,72px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 22 }}>Stop forgetting<br /><span style={{ background: "linear-gradient(135deg,#6C63FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>what you have learned.</span></h1>
        <p style={{ fontSize: 17, color: "#94A3B8", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>RecallIQ tracks every concept you study, calculates exactly when you will forget it, and reschedules revision at the perfect moment.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#6C63FF", color: "#fff", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Start for free ?</Link>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#94A3B8", padding: "14px 28px", borderRadius: 8, fontSize: 15, border: "1px solid rgba(255,255,255,0.13)", textDecoration: "none" }}>Login</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {[["47k+", "Concepts tracked"], ["92%", "Avg retention rate"], ["3.2k", "Students using it"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}><div style={{ fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 700, color: "#A78BFA" }}>{n}</div><div style={{ fontSize: 12, color: "#475569" }}>{l}</div></div>
          ))}
        </div>
      </section>
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, marginBottom: 48 }}>Everything your brain needs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, textAlign: "left" }}>
          {[["??", "Smart Upload", "PDFs, YouTube URLs, or articles. AI extracts every concept automatically."], ["?", "Knowledge Graph", "See how concepts connect. Live visual map of everything you know."], ["??", "Forgetting Engine", "Real-time retention scores. Know what you are about to forget before you forget it."], ["??", "AI Quiz Generator", "Auto-generated MCQs tailored to your weakest concepts."], ["?", "Spaced Repetition", "Day 1?3?7?15?30 schedule. Built around how memory works."], ["??", "Semantic Search", "Search the way you think. Finds it instantly."]].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background: "rgba(26,28,36,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, marginBottom: 14 }}>Ready to actually remember what you learn?</h2>
        <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 32 }}>Join thousands of students who stopped forgetting.</p>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#6C63FF", color: "#fff", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Create free account ?</Link>
      </section>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 800 }}>Recall<span style={{ background: "linear-gradient(135deg,#6C63FF,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IQ</span></div>
        <p style={{ fontSize: 12, color: "#475569" }}>© 2025 RecallIQ. Built for learners.</p>
      </footer>
    </div>
  );
}
