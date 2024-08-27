import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";
import {UnderlinedLink} from "@/components/underlinedlink";

export const SocialIcons = () => {
    const { theme } = useTheme();

    return (
        <div className="flex items-center space-x-2">

            <div className="flex md:hidden space-x-2">

                <a
                    href="https://www.linkedin.com/in/fasaich/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block"
                >
                    <Image
                        src={theme === "dark" ? "/icons/dark/linkedindark.svg" : "/icons/light/linkedin.svg"}
                        alt="linkedin"
                        width={30}
                        height={30}
                        className="max-w-[35px]"
                    />
                </a>

                <a
                    href="https://www.instagram.com/fuzz_ch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block"
                >
                    <Image
                        src={theme === "dark" ? "/icons/dark/instagramdark.svg" : "/icons/light/instagram.svg"}
                        alt="instagram"
                        width={30}
                        height={30}
                        className="max-w-[35px]"
                    />
                </a>

                <a
                    href="https://www.artstation.com/fuzz_ch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block"
                >
                    <div className={"w-[30px]"}>
                        <div className={"relative w-[28px] h-[30px]"}>
                            <Image
                                src={theme === "dark" ? "/icons/dark/artstationdark.svg" : "/icons/light/artstation.svg"}
                                alt="artstation"
                                width={30}
                                height={30}
                                style={{
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>
                </a>

                <a
                    href="https://www.instagram.com/fuzz_ch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block"
                >
                    <Image
                        src={theme === "dark" ? "/icons/dark/youtubedark.svg" : "/icons/light/youtube.svg"}
                        alt="youtube"
                        width={30}
                        height={30}
                        className="max-w-[35px]"
                    />
                </a>
            </div>


            <div className="hidden md:flex space-x-3 text-md font-mono md:space-x-5">
                <UnderlinedLink href="https://www.linkedin.com/in/fasaich/"
                                isExternal={true}> linkedin </UnderlinedLink>
                <UnderlinedLink href="https://www.instagram.com/fuzz_ch/" isExternal={true}> instagram </UnderlinedLink>
                <UnderlinedLink href="https://www.artstation.com/fuzz_ch"
                                isExternal={true}> artstation </UnderlinedLink>
                <UnderlinedLink href="https://www.youtube.com/@fuzz_ch" isExternal={true}> youtube </UnderlinedLink>
            </div>
        </div>
    );
};
