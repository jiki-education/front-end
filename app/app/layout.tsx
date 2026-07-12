import { AttributionCapture } from "@/components/AttributionCapture";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import PostHogPageview from "@/components/PostHogPageview";
import { ToasterProvider } from "@/components/toaster-config";
import { GlobalModalProvider } from "@/lib/modal";
import { SITE_URL } from "@/lib/site";
import { ThemeProvider } from "@/lib/theme";
import "@/lib/whyDidYouRender";
import type { Metadata } from "next";
import { ClientLocaleProvider } from "@/components/i18n/ClientLocaleProvider";
import { getLocale, getMessages } from "next-intl/server";
import { Poppins, Source_Code_Pro, Baloo_2 } from "next/font/google";
import Script from "next/script";
import { ServerAuthProvider } from "../components/layout/auth/global/ServerAuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["400", "600"]
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jiki",
  description:
    "Welcome to Jiki - the best place to learn to code and build in the agentic-coding era. Fun, effective and free!",
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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  // `seo` is server-only (consumed by generateMetadata via getTranslations) and no
  // client component reads it, so we omit it from the catalog handed to the client
  // provider rather than serializing it into every route's hydration payload.
  const { seo: _seo, ...messages } = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} ${sourceCodePro.variable} ${baloo2.variable} ui-body`}>
        <ClientLocaleProvider initialLocale={locale} initialMessages={messages}>
          <GlobalErrorHandler />
          <AttributionCapture />
          <ServerAuthProvider>
            <PostHogPageview />
            <ThemeProvider>
              <main style={{ width: "100%" }}>{children}</main>
              <GlobalModalProvider />
              <ToasterProvider />
            </ThemeProvider>
          </ServerAuthProvider>
          {process.env.NODE_ENV === "production" && (
            <Script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "116ada30355346edb0a7e818b80ed2ae"}'
              strategy="afterInteractive"
            />
          )}
        </ClientLocaleProvider>
      </body>
    </html>
  );
}
