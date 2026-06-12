import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "RecallIQ - Remember Everything You Learn",
  description: "AI-powered memory tracking using the Ebbinghaus forgetting curve",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0A0B0F", color: "#F1F5F9", fontFamily: "DM Sans, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
