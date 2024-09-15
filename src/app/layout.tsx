import type { Metadata } from "next";
import React from "react";
import { Header } from "@/components/header/header";
import "./globals.css";
import { ProviderTheme } from "@/app/themeprovider";
import Highlighter from "@/components/stylers/highlighter";
import { ExitAnimationProvider } from "@/app/exitcontext";
import { VisibilityProvider } from "@/app/recentsvisibilitycontext";
import { VisibilityProvider2 } from "@/app/introvisibilitycontext";

export const metadata: Metadata = {
    title: "fuzzch | portfolio",
    description: "welcome to my portfolio!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" suppressHydrationWarning={true}>
        <ProviderTheme>
            <ExitAnimationProvider>
                <VisibilityProvider>
                    <VisibilityProvider2>
                        <body>
                        <Highlighter/>
                        <Header/>
                        {children}
                        </body>
                    </VisibilityProvider2>
                </VisibilityProvider>
            </ExitAnimationProvider>
        </ProviderTheme>
        </html>
    );
}
