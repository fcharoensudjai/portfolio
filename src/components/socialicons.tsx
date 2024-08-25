import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";

export const SocialIcons = () => {
    const { theme } = useTheme();

    return (
        <div className="flex items-center space-x-2">

            <div className="flex md:hidden space-x-2">
                <Link href="https://www.linkedin.com/in/fasaich/">
                    <Image
                        src={theme === "dark" ? "/icons/dark/linkedindark.svg" : "/icons/light/linkedin.svg"}
                        alt="linkedin"
                        width={30}
                        height={30}
                        className="max-w-[35px]"
                    />
                </Link>
                <Link href="#">
                    <Image
                        src={theme === "dark" ? "/icons/dark/instagramdark.svg" : "/icons/light/instagram.svg"}
                        alt="instagram"
                        width={30}
                        height={30}
                        className="max-w-[35px]"
                    />
                </Link>

                <Link href="#">
                    <div className={"w-[30px]"}>
                        <div className={"relative w-[28px] h-[30px]"}>
                            <Image
                                src={theme === "dark" ? "/icons/dark/artstationdark.svg" : "/icons/light/artstation.svg"}
                                alt="artstation"
                                width={30}
                                height={30}
                                objectFit="contain"
                            />
                        </div>
                    </div>
                </Link>

                <Link href="#">
                    <Image
                        src={theme === "dark" ? "/icons/dark/youtubedark.svg" : "/icons/light/youtube.svg"}
                        alt="youtube"
                        width={30}
                        height={30}
                        className="max-w-[35px]"
                    />
                </Link>
            </div>


            <div className="hidden md:flex space-x-3 text-md md:space-x-5">
                <a href="https://www.linkedin.com/in/fasaich/" className="text-link"> linkedin </a>
                <a href="#" className="text-link"> instagram </a>
                <a href="#" className="text-link"> artstation </a>
                <a href="#" className="text-link"> youtube </a>
            </div>
        </div>
    );
};
