import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { ToasterProvider } from "@/components/toaster-config";
import { GlobalModalProvider } from "@/lib/modal";
import { ThemeProvider } from "@/lib/theme";
import "@/lib/whyDidYouRender";
import type { Metadata } from "next";
import { Poppins, Source_Code_Pro } from "next/font/google";
import Script from "next/script";
import { ServerAuthProvider } from "../components/layout/auth/global/ServerAuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"]
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Jiki",
  description: "Welcome to Jiki - the best place to learn to code. Fun, effective and free!"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${sourceCodePro.variable} antialiased ui-body`}>
        <Script src="/static/theme-script.js" strategy="beforeInteractive" />
        <GlobalErrorHandler />
        <ServerAuthProvider>
          <ThemeProvider>
            <main className="w-full">{children}</main>
            <GlobalModalProvider />
            <ToasterProvider />
          </ThemeProvider>
        </ServerAuthProvider>
      </body>
    </html>
  );
}
