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
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#F4F2FC", color: "#1A1A2E", fontFamily: "DM Sans, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}