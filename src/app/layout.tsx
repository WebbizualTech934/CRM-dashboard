import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Digital Marketing CRM | 3D Animation Sales Team",
  description: "Internal CRM workspace for managing 3D animation leads, campaigns, client follow-ups, and sales performance.",
};

import { CRMProvider } from "@/providers/crm-provider";
import { AuthProvider } from "@/hooks/use-auth";

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
        <AuthProvider>
          <CRMProvider>
            {children}
          </CRMProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
