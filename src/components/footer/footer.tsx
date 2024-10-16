import { LogoButton } from "@/components/logobutton";
import { LocalTime } from "@/components/footer/localtime";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useExitAnimation } from "@/app/exitcontext";
import { useVisibility } from "@/app/recentsvisibilitycontext";
import { useVisibility2 } from "@/app/introvisibilitycontext";
import React from "react";
import { UnderlinedLink } from "@/components/underlinedlink";

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const Footer = ( { exitDuration = 800 }) => {

    const { theme } = useTheme();
    const path = usePathname();
    const router = useRouter();
    const { setIsExit } = useExitAnimation();
    const { resetRecentsVisibility } = useVisibility();
    const { resetIntroVisibility } = useVisibility2();

    const baseCurrentPath = path.split('#')[0];
    const currentHash = path.split('#')[1];
    const targetHash = "home";
    const isCurrentPath = baseCurrentPath === "/";

    const scrollToTop = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isCurrentPath || (isCurrentPath && currentHash === targetHash)) {
            if (!isCurrentPath) {
                event.preventDefault();
                setIsExit(true);
                await sleep(exitDuration);
                router.push("/#home");
                setIsExit(false);
                resetRecentsVisibility();
                resetIntroVisibility();
            } else {
                event.preventDefault();
                window.scrollTo({
                    top: document.getElementById("home")?.offsetTop || 0,
                    behavior: "smooth",
                });
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center min-h-15dvh lg:px-7 lg:min-h-25dvh p-4 text-xs lg:text-sm xl:text-md">

                <div className="flex flex-row-reverse sm:flex-row items-center justify-start sm:space-x-5 h-full">

                    <div className="space-x-0 w-[60px] md:w-auto h-full">

                        <div className="hidden xl:block"><LogoButton size="medium"/></div>

                        <div className="hidden sm:block xl:hidden h-[80%] w-auto">
                            <Link href="/#home" onClick={scrollToTop}>
                                <Image
                                src={theme === "dark" ? "/portfolio/icons/dark/logodark.svg" : "/portfolio/icons/light/logo.svg"}
                                alt={"logo"}
                                width={200}
                                height={200}
                                />
                            </Link>
                        </div>

                    </div>

                    <div className="flex flex-col justify-between space-y-5 h-full">

                        <div className={"space-y-2"}>
                            <div>
                                artwork and website by
                                <br/>
                                Fasai Charoensudjai
                            </div>

                            <div>
                                © 2024 - all rights
                                <br/>
                                reserved
                            </div>
                        </div>

                        <div className="self-start">
                            <LocalTime/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between space-y-[1rem] h-full">

                    <div className={`whitespace-nowrap`}> [ my socials ]</div>

                    <div>
                        <ul className="flex-col space-y-1">
                            <li><UnderlinedLink isExternal={true}
                                                href="https://www.linkedin.com/in/fasaich/">linkedin</UnderlinedLink>
                            </li>
                            <li><UnderlinedLink isExternal={true}
                                                href="https://www.instagram.com/fuzz_ch/">instagram</UnderlinedLink>
                            </li>
                            <li><UnderlinedLink isExternal={true}
                                                href="https://www.artstation.com/fuzz_ch">artstation</UnderlinedLink>
                            </li>
                            <li><UnderlinedLink isExternal={true}
                                                href="https://www.youtube.com/@fuzz_ch">youtube</UnderlinedLink></li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>

    );
};
