import type { Metadata } from "next";
import React from "react";

import { Header } from "@/components/header";
import "./globals.css";
import { Provider } from "@/app/providers";

export const metadata: Metadata = {
    title: "fuzzch | portfolio",
    description: "welcome to my portfolio!",
};

export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <Provider>
                <body className={"bg-main-light dark:bg-text-light text-text-light dark:text-text-dark"}>
                    <Header />
                    {children}
                </body>
            </Provider>
        </html>
    );
}
