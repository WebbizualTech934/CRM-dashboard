import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CRM Dashboard | Lead & Project Management",
  description: "Professional CRM and project management dashboard for lead generation and team operations.",
};

import { CRMProvider } from "@/providers/crm-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <CRMProvider>
          {children}
        </CRMProvider>
      </body>
    </html>
  );
}
