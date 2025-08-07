import type { Metadata } from "next";
import React from "react";
import { Header } from "@/components/header/header";
import "./globals.css";
import { ProviderTheme } from "@/app/themeprovider";
import Highlighter from "@/components/stylers/highlighter";
import { ExitAnimationProvider } from "@/app/exitcontext";
import { VisibilityProvider } from "@/app/recentsvisibilitycontext";
import { VisibilityProvider2 } from "@/app/introvisibilitycontext";
import { VisibilityProvider3 } from "@/app/contactvisibilitycontext";

export const metadata: Metadata = {
    title: "fuzzch | portfolio",
    description: "welcome to my portfolio!",
    openGraph: {
        title: "fuzzch | portfolio",
        description: "welcome to my portfolio!",
        images: [
            {
                url: "/portfolio/icons/dark/logodark.svg",
                width: 1200,
                height: 630,
                alt: "fuzzch portfolio preview",
            },
        ],
    },

};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" suppressHydrationWarning={true}>
        <body>
            <ProviderTheme>
                <ExitAnimationProvider>
                    <VisibilityProvider>
                        <VisibilityProvider2>
                            <VisibilityProvider3>
                                <Highlighter/>
                                <Header/>
                                <div className={`bg-middle-colour`}>{children}</div>
                            </VisibilityProvider3>
                    </VisibilityProvider2>
                </VisibilityProvider>
            </ExitAnimationProvider>
            </ProviderTheme>
        </body>
        </html>
    );
}
