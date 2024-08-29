import type { Metadata } from "next";
import React from "react";
import { Header } from "@/components/header/header";
import "./globals.css";
import { Provider } from "@/app/providers";
import Loader from "@/components/stylers/loader";
import Highlighter from "@/components/stylers/highlighter";

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
                <Loader />
                <Header />
                {children}
            </body>
        </Provider>
        </html>
    );
}
