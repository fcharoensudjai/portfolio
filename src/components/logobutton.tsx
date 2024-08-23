import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export const LogoButton = () => {

    const { theme } = useTheme();

    return (
        <Link href="/">
            <div className="relative w-32 h-[49.9px] md:w-56 md:h-[77.63px]">
                <Image
                    src={theme === "dark" ? "/icons/dark/logodark.svg" : "/icons/light/logo.svg"}
                    alt="logo"
                    layout="fill"
                    objectFit="contain"
                />
            </div>

        </Link>
    )
}
