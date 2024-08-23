import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useTheme} from "next-themes";

export const SocialIcons = () => {

    const { theme } = useTheme();

    return (

        <div className={"flex items-center space-x-3"}>

            <Link href={"#"}>
                <Image

                    src={theme === "dark" ? "/icons/dark/linkedindark.svg" : "/icons/light/linkedinlight.svg"}
                    alt="linkedin"
                    width={35}
                    height={35}
                    layout="fixed"
                    className="max-w-[40px]"
                />
            </Link>

            <Link href={"#"}>
                <Image

                    src={theme === "dark" ? "/icons/dark/instagramdark.svg" : "/icons/light/instagram.svg"}
                    alt="instagram"
                    width={35}
                    height={35}
                    layout="fixed"
                    className="max-w-[40px]"
                />
            </Link>

            <Link href={"#"}>
                <Image

                    src={theme === "dark" ? "/icons/dark/artstationdark.svg" : "/icons/light/artstation.svg"}
                    alt="artstation"
                    width={35}
                    height={35}
                    layout="fixed"
                    className="max-w-[40px]"
                />
            </Link>

            <Link href={"#"}>
                <Image

                    src={theme === "dark" ? "/icons/dark/youtubedark.svg" : "/icons/light/youtube.svg"}
                    alt="youtube"
                    width={35}
                    height={35}
                    layout="fixed"
                    className="max-w-[40px]"
                />
            </Link>

        </div>
    )
}