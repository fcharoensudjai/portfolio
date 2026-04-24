"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitch() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={30}
        height={30}
        alt="loading light/dark toggle"
        priority={false}
        title="loading light/dark toggle"
        className={"w-[30px] h-[30px]"}
      />
    );

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-[36px] w-[36px] items-center justify-center"
      aria-label="toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Image
          src={`${basePath}/icons/dark/sun.svg`}
          alt="switch to light mode"
          width={30}
          height={30}
          className={"w-[30px] h-[30px]"}
        />
      ) : (
        <Image
          src={`${basePath}/icons/light/moon.svg`}
          alt="switch to dark mode"
          width={30}
          height={30}
          className={"w-[30px] h-[30px]"}
        />
      )}
    </button>
  );
}
