"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState<boolean>(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) return (
        <Image
            src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
            width={30}
            height={30}
            alt="loading light/dark toggle"
            priority={false}
            title="loading light/dark toggle"
            className={"md:w-[36px] md:h-[36px]"}
        />
    );

    return (
        <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
            {resolvedTheme === 'dark' ? (
                <Image src="/icons/dark/sun.svg"
                       alt="switch to light mode"
                       width={30}
                       height={30}
                       className={"md:w-[36px] md:h-[36px]"}
                />
            ) : (
                <Image
                    src="/icons/light/moon.svg"
                    alt="switch to dark mode"
                    width={30}
                    height={30}
                    className={"md:w-[36px] md:h-[36px]"}
                />
            )}
        </button>
    );
}
