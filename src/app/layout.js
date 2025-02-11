import { Geist, Geist_Mono } from "next/font/google";
import FlowerCanvas from "./components/FlowerCanvas";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dear Maryam",
  description: "For my Maryam",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="blur-container">
          <FlowerCanvas />
            {children}            
      </body>
    </html>
  );
}