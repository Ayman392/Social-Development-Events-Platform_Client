import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Home/Navbar/page";
import Footer from "@/components/Home/Footer/page";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oikyo",
  description:
    "Oikyo brings volunteers and organizers together. Find upcoming community service events across Bangladesh, join a cause near you, or create your own event.",
};

// Runs before the page becomes interactive, so the saved theme is applied with no flash
const themeScript = `
  (function () {
    try {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
