"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ProviderTheme({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // avoid hydration mismatch by only rendering provider after the client has mounted
    if (!mounted) return null;

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
        >
            {children}
        </ThemeProvider>
    );
}
