"use client";
import Link from "next/link";

export default function Home() {
  const navLink = { color: "#6B6B80", fontSize: 14, fontWeight: 600, textDecoration: "none" } as any;

  const featureCard = (icon: string, bg: string, fg: string, title: string, desc: string) => (
    <div key={title} style={{ background: "#FFFFFF", borderRadius: 20, padding: 26 }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <i className={"ti " + icon} style={{ fontSize: 21, color: fg }} />
      </div>
      <h3 style={{ fontFamily: "Outfit,sans-serif", fontSize: 16.5, fontWeight: 700, marginBottom: 8, color: "#1A1A2E" }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: "#6B6B80", lineHeight: 1.65 }}>{desc}</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F4F2FC", color: "#1A1A2E" }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px",
        position: "sticky", top: 0, background: "rgba(244,242,252,0.85)", backdropFilter: "blur(10px)", zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: 15 }}>R</div>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 19, fontWeight: 800, color: "#1A1A2E" }}>RecallIQ</span>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          <Link href="#features" style={navLink}>Features</Link>
          <Link href="/login" style={navLink}>Login</Link>
          <Link href="/register" style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", padding: "11px 22px", borderRadius: 24, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Get started free</Link>
        </div>
      </nav>

      <section style={{ textAlign: "center", padding: "90px 24px 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse,#C4B5FD66,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, padding: "8px 18px", borderRadius: 22, background: "#fff", color: "#7C3AED", marginBottom: 30, position: "relative" }}>
          <i className="ti ti-sparkles" style={{ fontSize: 15 }} /> Powered by Ebbinghaus forgetting science
        </div>
        <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: "clamp(40px,7vw,72px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, marginBottom: 22, color: "#1A1A2E", position: "relative" }}>
          Stop forgetting<br />
          <span style={{ background: "linear-gradient(120deg,#7C3AED,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>what you have learned.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#6B6B80", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.7, position: "relative" }}>
          RecallIQ tracks every concept you study, calculates exactly when you will forget it, and reschedules revision at the perfect moment.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56, position: "relative" }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", padding: "15px 30px", borderRadius: 26, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Start for free <i className="ti ti-arrow-right" style={{ fontSize: 17 }} />
          </Link>
          <Link href="/login" style={{ background: "#FFFFFF", color: "#1A1A2E", padding: "15px 30px", borderRadius: 26, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Login</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 44, flexWrap: "wrap", position: "relative" }}>
          {[["47k+", "Concepts tracked"], ["92%", "Avg retention rate"], ["3.2k", "Students using it"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 30, fontWeight: 800, background: "linear-gradient(135deg,#7C3AED,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
              <div style={{ fontSize: 12.5, color: "#9A9AA8", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "20px 24px 90px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(120deg,#7C3AED,#5B21B6 55%,#1E1B4B)", borderRadius: 28, padding: "40px 44px",
          display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", flexWrap: "wrap", gap: 24
        }}>
          <div>
            <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Your forgetting curve, visualized</div>
            <div style={{ fontSize: 13.5, color: "#D8D2F5", maxWidth: 360 }}>R = e^(-λt). Without revision you lose up to 80% of new knowledge within a week. RecallIQ fights this automatically.</div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[["100%", "Just learned"], ["49%", "Day 7"], ["9%", "Day 30"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 18px" }}>
                <div style={{ fontFamily: "Outfit,sans-serif", fontSize: 22, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 11, color: "#D8D2F5", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" style={{ padding: "0 24px 90px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginBottom: 48, color: "#1A1A2E" }}>
          Everything your brain needs
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, textAlign: "left" }}>
          {[
            ["ti-upload", "#EDE9FE", "#7C3AED", "Smart upload", "PDFs, YouTube URLs, or articles. AI extracts every concept automatically."],
            ["ti-sitemap", "#FCE7F3", "#DB2777", "Knowledge graph", "See how concepts connect. Live visual map of everything you know."],
            ["ti-chart-line", "#DBEAFE", "#2563EB", "Forgetting engine", "Real-time retention scores. Know what you are about to forget."],
            ["ti-brain", "#FEF3C7", "#D97706", "AI quiz generator", "Auto-generated questions tailored to your weakest concepts."],
            ["ti-refresh", "#D1FAE5", "#059669", "Spaced repetition", "Day 1 to 3 to 7 to 15 to 30 schedule, built around how memory works."],
            ["ti-search", "#EDE9FE", "#7C3AED", "Semantic search", "Search the way you think. Finds the right concept instantly."],
          ].map(([icon, bg, fg, title, desc]) => featureCard(icon, bg, fg, title, desc))}
        </div>
      </section>

      <section style={{ textAlign: "center", padding: "70px 24px 100px" }}>
        <div style={{
          maxWidth: 760, margin: "0 auto", background: "linear-gradient(120deg,#7C3AED,#EC4899)", borderRadius: 28, padding: "56px 40px", color: "#fff"
        }}>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, marginBottom: 14 }}>
            Ready to actually remember what you learn?
          </h2>
          <p style={{ fontSize: 15, color: "#F3E8FF", marginBottom: 28 }}>Join thousands of students who stopped forgetting.</p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#7C3AED", padding: "15px 30px", borderRadius: 26, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Create free account <i className="ti ti-arrow-right" style={{ fontSize: 17 }} />
          </Link>
        </div>
      </section>

      <footer style={{ padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: 12 }}>R</div>
          <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>RecallIQ</span>
        </div>
        <p style={{ fontSize: 12.5, color: "#9A9AA8" }}>2025 RecallIQ. Built for learners.</p>
      </footer>
    </div>
  );
}