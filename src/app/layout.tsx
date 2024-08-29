import type { Metadata } from "next";
import React from "react";
import { Header } from "@/components/header/header";
import "./globals.css";
import { ProviderTheme } from "@/app/themeprovider";
import Highlighter from "@/components/stylers/highlighter";
import { ExitAnimationProvider } from "@/app/exitcontext";

export const metadata: Metadata = {
    title: "fuzzch | portfolio",
    description: "welcome to my portfolio!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" suppressHydrationWarning={true}>
        <ProviderTheme>
            <ExitAnimationProvider>
                <body>
                <Highlighter/>
                <Header/>
                {children}
                </body>
            </ExitAnimationProvider>
        </ProviderTheme>
        </html>
    );
}
