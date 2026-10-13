import type { Metadata } from "next";
import React from "react";
import { Roboto_Mono } from "next/font/google";
import { Header } from "@/components/header/header";
import "./globals.css";
import { ProviderTheme } from "@/app/providers/themeprovider";
import Highlighter from "@/components/stylers/highlighter";
import { PetalFollow } from "@/components/petalfollow";
import { ExitAnimationProvider } from "@/app/contexts/exitcontext";
import { VisibilityProvider } from "@/app/contexts/recentsvisibilitycontext";
import { VisibilityProvider2 } from "@/app/contexts/introvisibilitycontext";
import { VisibilityProvider3 } from "@/app/contexts/contactvisibilitycontext";
import LenisProvider from "@/app/providers/lenisprovider";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "fuzzch | portfolio",
  description: "welcome to my portfolio!",
  icons: {
    icon: `${basePath}/icons/dark/logodark.svg`, // logo for thumbnail
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={robotoMono.variable}>
      <body>
        <ProviderTheme>
          <LenisProvider>
            <ExitAnimationProvider>
              <VisibilityProvider>
                <VisibilityProvider2>
                  <VisibilityProvider3>
                    <Highlighter />
                    <PetalFollow />
                    <Header />
                    <div className={`bg-surface-mid`}>{children}</div>
                  </VisibilityProvider3>
                </VisibilityProvider2>
              </VisibilityProvider>
            </ExitAnimationProvider>
          </LenisProvider>
        </ProviderTheme>
      </body>
    </html>
  );
}
