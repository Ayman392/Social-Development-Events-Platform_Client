import type { Metadata } from "next";
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
  title: "HopeNetwork",
  description:
    "Discover and join community service events across Bangladesh, or create your own.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer/>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}