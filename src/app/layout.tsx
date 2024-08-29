import type { Metadata } from "next";
import React from "react";
import { Header } from "@/components/header/header";
import "./globals.css";
import { Provider } from "@/app/providers";
import Highlighter from "@/components/stylers/highlighter";
import { Unmounter } from "@/components/stylers/unmounter";

export const metadata: Metadata = {
    title: "fuzzch | portfolio",
    description: "welcome to my portfolio!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" suppressHydrationWarning={true}>
        <Provider>
            <body>
                <Highlighter/>
                <Header />
                <Unmounter delay={1000} visible={true}>{children}</Unmounter>
            </body>
        </Provider>
        </html>
    );
}
