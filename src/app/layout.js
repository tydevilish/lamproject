import { Noto_Sans_Thai } from "next/font/google";

import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import BootstrapClient from "./components/BootstrapClient";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "Leave a Message",
  description: "ฝากข้อความ แบ่งปันโค้ด แชร์ความคิด — รวดเร็ว เรียบง่าย ใช้งานฟรี",
  keywords: "ฝากข้อความ, pastebin, แชร์โค้ด, โค้ดออนไลน์, แบ่งปันข้อความ, โปรแกรมเมอร์, note, snippet, leave a message",
  authors: [{ name: "ทีม Leave a Message", url: "https://lam-iota.vercel.app" }],
  creator: "ทีม Leave a Message",
  publisher: "ทีม Leave a Message",
  icons: {
    icon: "/logo.png", 
    shortcut: "/favicon.ico" 
  },
  openGraph: {
    title: "Leave a Message",
    description: "ฝากข้อความและแชร์โค้ดกับ Leave a Message — เว็บฝากข้อความและโค้ด",
    url: "https://lam-iota.vercel.app",
    siteName: "Leave a Message",
    images: [
      {
        url: "https://lam-iota.vercel.app/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Leave a Message - ฝากข้อความและแชร์โค้ด",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSansThai.variable}`}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
