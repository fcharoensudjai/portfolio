import type { Metadata } from "next";
import React from "react";

import { Header } from "@/components/header";
import "./globals.css";


export const metadata: Metadata = {
    title: "fuzzch | portfolio",
    description: "welcome to my portfolio!",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <Header />
        {children}
        </body>
        </html>
    );
}
