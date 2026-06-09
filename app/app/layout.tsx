import { AttributionCapture } from "@/components/AttributionCapture";
import { CheckoutReturnHandler } from "@/components/checkout/CheckoutReturnHandler";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { ToasterProvider } from "@/components/toaster-config";
import { WelcomeModalHandler } from "@/components/WelcomeModalHandler";
import { GlobalModalProvider } from "@/lib/modal";
import { SITE_URL } from "@/lib/site";
import { ThemeProvider } from "@/lib/theme";
import "@/lib/whyDidYouRender";
import type { Metadata } from "next";
import { Poppins, Source_Code_Pro, Baloo_2 } from "next/font/google";
import { ServerAuthProvider } from "../components/layout/auth/global/ServerAuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"]
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jiki",
  description: "Welcome to Jiki - the best place to learn to code and build in the LLM-era. Fun, effective and free!",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/static/images/icon.svg", type: "image/svg+xml" }
    ],
    apple: "/static/images/apple-icon.png"
  },
  openGraph: {
    images: [{ url: "/static/images/og-image.png", width: 1200, height: 630, alt: "Jiki - learn to code" }]
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${sourceCodePro.variable} ${baloo2.variable} antialiased ui-body`}>
        <GlobalErrorHandler />
        <AttributionCapture />
        <ServerAuthProvider>
          <ThemeProvider>
            <main className="w-full">{children}</main>
            <GlobalModalProvider />
            <ToasterProvider />
            <CheckoutReturnHandler />
            <WelcomeModalHandler />
          </ThemeProvider>
        </ServerAuthProvider>
      </body>
    </html>
  );
}
