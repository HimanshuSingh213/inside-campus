import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Inside Campus — The Insider Intelligence Network for Students",
  description:
    "Inside Campus is a college intelligence platform where seniors share actionable academic and career insights. Discover internship timelines, scholarship deadlines, placement prep, and hidden opportunities — all in one trusted student network.",
  keywords:
    "college intelligence, student network, internship timeline, scholarship deadlines, placement preparation, campus insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
