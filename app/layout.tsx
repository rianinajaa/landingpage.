import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { HeaderFallback } from "@/components/site/header-fallback";
import { ScrollMotion } from "@/components/site/scroll-motion";
import { JsonLd } from "@/components/site/json-ld";
import { brand } from "@/content/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name} | Design, development and AI`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} | Design, development and AI`,
    description: brand.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | Design, development and AI`,
    description: brand.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#121517",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={brand.locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: brand.name,
            legalName: brand.legalName,
            url: brand.siteUrl,
            email: brand.email,
            description: brand.description,
            slogan: brand.tagline,
            areaServed: "Worldwide",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: brand.name,
            url: brand.siteUrl,
            description: brand.description,
            inLanguage: brand.locale,
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <Suspense fallback={null}>
          <ScrollMotion />
        </Suspense>
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
