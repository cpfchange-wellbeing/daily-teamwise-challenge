import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily TeamWise Challenge",
  description: "Daily well-being game for leaders and team members"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
